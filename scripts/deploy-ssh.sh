#!/usr/bin/env bash
set -Eeuo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DIST_DIR="${DIST_DIR:-${ROOT_DIR}/dist}"
PRODUCTION_URL="${PRODUCTION_URL:-https://ssatcy.com}"
LOCK_DIR="${TMPDIR:-/tmp}/ssatcy-com-deploy.lock"
RELEASE_ID="$(date -u +%Y%m%dT%H%M%SZ)-$$"

if [[ ! -f "${DIST_DIR}/index.html" || ! -d "${DIST_DIR}/assets" ]]; then
  echo "Missing production build at ${DIST_DIR}; run npm run build first." >&2
  exit 1
fi

if ! mkdir "${LOCK_DIR}" 2>/dev/null; then
  echo "Another SSATCY deployment is already running (${LOCK_DIR})." >&2
  exit 1
fi

IS_LOCAL_DEPLOY=0
if [[ -n "${DEPLOY_LOCAL_TARGET:-}" ]]; then
  IS_LOCAL_DEPLOY=1
  REMOTE_PATH="${DEPLOY_LOCAL_TARGET%/}"
  remote_sh() { bash -s -- "$@"; }
else
  NAS_SSH_HELPER="${NAS_SSH_HELPER:-${ROOT_DIR}/../gorfednet.github/scripts/nas-ssh-deploy.sh}"
  if [[ ! -f "${NAS_SSH_HELPER}" ]]; then
    echo "Missing NAS SSH helper: ${NAS_SSH_HELPER}" >&2
    exit 1
  fi
  # shellcheck source=../../gorfednet.github/scripts/nas-ssh-deploy.sh
  source "${NAS_SSH_HELPER}"
  nas_ssh_load_env "${ROOT_DIR}"
  NAS_SITE_DIR="${NAS_SITE_DIR:-ssatcy.com}"
  REMOTE_PATH="$(nas_ssh_remote_path "${NAS_SITE_DIR}")"
  # shellcheck disable=SC2207
  SSH_CMD=(ssh $(nas_ssh_options) "${NAS_SSH_USER}@${NAS_SSH_HOST}")
  nas_ssh_preflight "${NAS_SITE_DIR}"
  remote_sh() { "${SSH_CMD[@]}" bash -s -- "$@"; }
fi

REMOTE_STAGE="${REMOTE_PATH}/.deploy-staging/${RELEASE_ID}"

cleanup() {
  if [[ "${IS_LOCAL_DEPLOY}" == "1" ]]; then
    rm -rf "${REMOTE_STAGE}" 2>/dev/null || true
  else
    "${SSH_CMD[@]}" "rm -rf '${REMOTE_STAGE}'" 2>/dev/null || true
  fi
  rmdir "${LOCK_DIR}" 2>/dev/null || true
}
trap cleanup EXIT

echo "Staging complete release before touching live files..."
if [[ "${IS_LOCAL_DEPLOY}" == "1" ]]; then
  mkdir -p "${REMOTE_STAGE}"
  tar -C "${DIST_DIR}" -cf - . | tar -C "${REMOTE_STAGE}" -xf -
else
  "${SSH_CMD[@]}" "mkdir -p '${REMOTE_STAGE}'"
  tar -C "${DIST_DIR}" -cf - . | "${SSH_CMD[@]}" "tar -C '${REMOTE_STAGE}' -xf -"
fi

EXPECTED_ASSETS="$(find "${DIST_DIR}/assets" -type f | wc -l | tr -d ' ')"
remote_sh "${REMOTE_STAGE}" "${EXPECTED_ASSETS}" <<'REMOTE_VERIFY'
set -eu
stage="$1"
expected_assets="$2"
test -f "${stage}/index.html"
actual_assets="$(find "${stage}/assets" -type f | wc -l | tr -d ' ')"
test "${actual_assets}" = "${expected_assets}"
REMOTE_VERIFY

if [[ "${DEPLOY_FAIL_AFTER_STAGE:-0}" == "1" ]]; then
  echo "Simulated interruption after staging." >&2
  exit 20
fi

echo "Phase 1/4: publishing immutable assets without deleting prior releases..."
remote_sh "${REMOTE_STAGE}" "${REMOTE_PATH}" <<'REMOTE_ASSETS'
set -eu
stage="$1"
target="$2"
mkdir -p "${target}/assets"
for source in "${stage}"/assets/*; do
  name="${source##*/}"
  destination="${target}/assets/${name}"
  if [[ ! -e "${destination}" ]]; then
    temporary="${target}/assets/.${name}.uploading-$$"
    cp -p "${source}" "${temporary}"
    mv -f "${temporary}" "${destination}"
  fi
done
REMOTE_ASSETS

if [[ "${DEPLOY_SKIP_ORIGIN_VERIFY:-0}" != "1" ]]; then
  echo "Phase 2/4: verifying uploaded assets through the production origin..."
  node "${ROOT_DIR}/scripts/verify-production.mjs" \
    --assets-only \
    --base-url "${PRODUCTION_URL}" \
    --dist "${DIST_DIR}"
else
  echo "Phase 2/4: origin verification skipped for deployment test."
fi

echo "Phase 3/4: publishing non-HTML files..."
remote_sh "${REMOTE_STAGE}" "${REMOTE_PATH}" <<'REMOTE_STATIC'
set -eu
stage="$1"
target="$2"
find "${stage}" -mindepth 1 -maxdepth 1 -type f ! -name index.html |
while IFS= read -r source; do
  name="${source##*/}"
  temporary="${target}/.${name}.uploading-$$"
  cp -p "${source}" "${temporary}"
  mv -f "${temporary}" "${target}/${name}"
done
REMOTE_STATIC

echo "Phase 4/4: publishing route HTML, with the root entrypoint last..."
remote_sh "${REMOTE_STAGE}" "${REMOTE_PATH}" <<'REMOTE_HTML'
set -eu
stage="$1"
target="$2"
for route in bio music film games live gallery contact; do
  mkdir -p "${target}/${route}"
  temporary="${target}/${route}/.index.html.uploading-$$"
  cp -p "${stage}/${route}/index.html" "${temporary}"
  mv -f "${temporary}" "${target}/${route}/index.html"
done
temporary="${target}/.index.html.uploading-$$"
cp -p "${stage}/index.html" "${temporary}"
mv -f "${temporary}" "${target}/index.html"
REMOTE_HTML

if [[ "${DEPLOY_SKIP_ORIGIN_VERIFY:-0}" != "1" ]]; then
  node "${ROOT_DIR}/scripts/verify-production.mjs" \
    --base-url "${PRODUCTION_URL}" \
    --dist "${DIST_DIR}"
fi

echo "Deployment completed to ${REMOTE_PATH} over SSH."

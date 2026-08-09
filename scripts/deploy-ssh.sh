#!/usr/bin/env bash
set -Eeuo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DIST_DIR="${DIST_DIR:-${ROOT_DIR}/dist}"
PRODUCTION_URL="${PRODUCTION_URL:-https://ssatcy.com}"
LOCK_DIR="${TMPDIR:-/tmp}/ssatcy-com-deploy.lock"

if [[ ! -f "${DIST_DIR}/index.html" || ! -d "${DIST_DIR}/assets" ]]; then
  echo "Missing production build at ${DIST_DIR}; run npm run build first." >&2
  exit 1
fi

if [[ -n "${DEPLOY_LOCAL_TARGET:-}" ]]; then
  REMOTE_TARGET="${DEPLOY_LOCAL_TARGET%/}/"
  run_rsync() { rsync -av "$@"; }
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
  RSYNC_SHELL="$(nas_ssh_rsync_shell)"
  REMOTE_TARGET="$(nas_ssh_target "${NAS_SITE_DIR}")"
  nas_ssh_preflight "${NAS_SITE_DIR}"
  run_rsync() {
    rsync \
      -avz \
      --timeout=90 \
      --partial-dir=.rsync-partial \
      -e "${RSYNC_SHELL}" \
      "$@"
  }
fi

if ! mkdir "${LOCK_DIR}" 2>/dev/null; then
  echo "Another SSATCY deployment is already running (${LOCK_DIR})." >&2
  exit 1
fi
trap 'rmdir "${LOCK_DIR}" 2>/dev/null || true' EXIT

echo "Phase 1/4: uploading immutable assets without deleting the current release..."
run_rsync --ignore-existing "${DIST_DIR}/assets/" "${REMOTE_TARGET}assets/"

if [[ "${DEPLOY_SKIP_ORIGIN_VERIFY:-0}" != "1" ]]; then
  echo "Phase 2/4: verifying uploaded assets through the production origin..."
  node "${ROOT_DIR}/scripts/verify-production.mjs" \
    --assets-only \
    --base-url "${PRODUCTION_URL}" \
    --dist "${DIST_DIR}"
else
  echo "Phase 2/4: origin verification skipped for deployment test."
fi

echo "Phase 3/4: uploading non-HTML files..."
run_rsync \
  --exclude="assets/" \
  --exclude="index.html" \
  --exclude="*/index.html" \
  "${DIST_DIR}/" \
  "${REMOTE_TARGET}"

echo "Phase 4/4: publishing route HTML, with the root entrypoint last..."
run_rsync --include="*/" --include="*/index.html" --exclude="*" "${DIST_DIR}/" "${REMOTE_TARGET}"
run_rsync "${DIST_DIR}/index.html" "${REMOTE_TARGET}index.html"

if [[ "${DEPLOY_SKIP_ORIGIN_VERIFY:-0}" != "1" ]]; then
  node "${ROOT_DIR}/scripts/verify-production.mjs" \
    --base-url "${PRODUCTION_URL}" \
    --dist "${DIST_DIR}"
fi

echo "Deployment completed to ${REMOTE_TARGET}"

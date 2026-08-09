#!/usr/bin/env bash
set -Eeuo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DIST_DIR="${DIST_DIR:-${ROOT_DIR}/dist}"
PRODUCTION_URL="${PRODUCTION_URL:-https://ssatcy.com}"
LOCK_DIR="${TMPDIR:-/tmp}/ssatcy-com-deploy.lock"
DEPLOY_DIST_DIR="${DIST_DIR}"
STAGING_DIR=""

if [[ ! -f "${DIST_DIR}/index.html" || ! -d "${DIST_DIR}/assets" ]]; then
  echo "Missing production build at ${DIST_DIR}; run npm run build first." >&2
  exit 1
fi

acquire_lock() {
  if mkdir "${LOCK_DIR}" 2>/dev/null; then
    printf '%s\n' "$$" > "${LOCK_DIR}/pid"
    return
  fi

  lock_pid="$(cat "${LOCK_DIR}/pid" 2>/dev/null || true)"
  if [[ "${lock_pid}" =~ ^[0-9]+$ ]] && kill -0 "${lock_pid}" 2>/dev/null; then
    echo "Another SSATCY deployment is already running (PID ${lock_pid})." >&2
    exit 1
  fi

  echo "Removing stale deployment lock ${LOCK_DIR}."
  rm -rf "${LOCK_DIR}"
  mkdir "${LOCK_DIR}"
  printf '%s\n' "$$" > "${LOCK_DIR}/pid"
}

acquire_lock

RSYNC_PERMISSION_ARGS=(--no-perms --no-owner --no-group --chmod=D755,F644)
if [[ "$(rsync --version 2>&1)" == openrsync:* ]]; then
  # macOS openrsync rejects D/F chmod rules. Normalize a disposable local
  # source copy and preserve those modes instead; the remote root is untouched.
  STAGING_DIR="$(mktemp -d "${TMPDIR:-/tmp}/ssatcy-com-deploy.XXXXXX")"
  cp -R "${DIST_DIR}/." "${STAGING_DIR}/"
  find "${STAGING_DIR}" -type d -exec chmod 0755 {} \;
  find "${STAGING_DIR}" -type f -exec chmod 0644 {} \;
  DEPLOY_DIST_DIR="${STAGING_DIR}"
  RSYNC_PERMISSION_ARGS=(--no-perms --no-owner --no-group)
fi

if [[ -n "${DEPLOY_LOCAL_TARGET:-}" ]]; then
  REMOTE_TARGET="${DEPLOY_LOCAL_TARGET%/}/"
  run_rsync() {
    (umask 022; rsync -rltv "${RSYNC_PERMISSION_ARGS[@]}" "$@")
  }
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
      -rltvz \
      "${RSYNC_PERMISSION_ARGS[@]}" \
      --timeout=120 \
      --partial-dir=.rsync-partial \
      --rsync-path="umask 022 && rsync" \
      -e "${RSYNC_SHELL}" \
      "$@"
    nas_ssh_ensure_readable_files "${!#}"
  }
fi

cleanup() {
  if [[ -n "${STAGING_DIR}" ]]; then
    rm -rf "${STAGING_DIR}" 2>/dev/null || true
  fi
  rm -rf "${LOCK_DIR}" 2>/dev/null || true
}
trap cleanup EXIT

echo "Phase 1/4: uploading immutable assets without deleting the current release..."
run_rsync --ignore-existing "${DEPLOY_DIST_DIR}/assets/" "${REMOTE_TARGET}assets/"

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
  "${DEPLOY_DIST_DIR}/" \
  "${REMOTE_TARGET}"

echo "Phase 4/4: publishing route HTML, with the root entrypoint last..."
for route in bio music film games live gallery contact; do
  run_rsync \
    "${DEPLOY_DIST_DIR}/${route}/index.html" \
    "${REMOTE_TARGET}${route}/index.html"
done
run_rsync "${DEPLOY_DIST_DIR}/index.html" "${REMOTE_TARGET}index.html"

if [[ "${DEPLOY_SKIP_ORIGIN_VERIFY:-0}" != "1" ]]; then
  node "${ROOT_DIR}/scripts/verify-production.mjs" \
    --base-url "${PRODUCTION_URL}" \
    --dist "${DIST_DIR}"
fi

echo "Deployment completed to ${REMOTE_TARGET}"

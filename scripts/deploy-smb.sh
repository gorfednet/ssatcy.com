#!/usr/bin/env bash
set -Eeuo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DIST_DIR="${DIST_DIR:-${ROOT_DIR}/dist}"
SMB_DEPLOY_TARGET="${SMB_DEPLOY_TARGET:-}"
PRODUCTION_URL="${PRODUCTION_URL:-https://ssatcy.com}"
DEPLOY_COPY_TIMEOUT="${DEPLOY_COPY_TIMEOUT:-300}"
COPY_SCRIPT="${COPY_SCRIPT:-${ROOT_DIR}/scripts/copy-to-smb.py}"
LOCK_DIR="${TMPDIR:-/tmp}/ssatcy-com-deploy.lock"

if [[ -z "${SMB_DEPLOY_TARGET}" ]]; then
  echo "Set SMB_DEPLOY_TARGET to the mounted site root." >&2
  exit 1
fi

if [[ ! -f "${DIST_DIR}/index.html" || ! -d "${DIST_DIR}/assets" ]]; then
  echo "Missing production build at ${DIST_DIR}; run npm run build first." >&2
  exit 1
fi

if ! mkdir "${LOCK_DIR}" 2>/dev/null; then
  echo "Another SSATCY deployment is already running (${LOCK_DIR})." >&2
  exit 1
fi
trap 'rmdir "${LOCK_DIR}" 2>/dev/null || true' EXIT

echo "Checking SMB target responsiveness..."
python3 - "${SMB_DEPLOY_TARGET}" "30" <<'PY'
import os
import signal
import sys

target = sys.argv[1]
timeout = int(sys.argv[2])

def handle_timeout(_signum, _frame):
    raise TimeoutError(f"SMB target did not respond within {timeout} seconds")

signal.signal(signal.SIGALRM, handle_timeout)
signal.alarm(timeout)
try:
    if not os.path.isdir(target):
        raise FileNotFoundError(f"SMB target does not exist: {target}")
    with os.scandir(target) as entries:
        next(entries, None)
finally:
    signal.alarm(0)
PY

run_copy() {
  perl -e '$timeout = shift; alarm $timeout; exec @ARGV' \
    "${DEPLOY_COPY_TIMEOUT}" \
    python3 \
    "${COPY_SCRIPT}" \
    "$@"
}

echo "Phase 1/4: uploading immutable assets without deleting the current release..."
run_copy \
  --skip-existing-size \
  "${DIST_DIR}/assets" \
  "${SMB_DEPLOY_TARGET}/assets"

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
run_copy \
  --exclude="assets/*" \
  --exclude="index.html" \
  --exclude="*/index.html" \
  "${DIST_DIR}" \
  "${SMB_DEPLOY_TARGET}"

echo "Phase 4/4: publishing route HTML, with the root entrypoint last..."
run_copy \
  --include="*/index.html" \
  "${DIST_DIR}" \
  "${SMB_DEPLOY_TARGET}"
run_copy "${DIST_DIR}/index.html" "${SMB_DEPLOY_TARGET}/index.html"

if [[ "${DEPLOY_SKIP_ORIGIN_VERIFY:-0}" != "1" ]]; then
  node "${ROOT_DIR}/scripts/verify-production.mjs" \
    --base-url "${PRODUCTION_URL}" \
    --dist "${DIST_DIR}"
fi

echo "Deployment completed without deleting prior hashed assets."

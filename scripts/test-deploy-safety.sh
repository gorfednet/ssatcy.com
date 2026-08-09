#!/usr/bin/env bash
set -Eeuo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TEST_ROOT="$(mktemp -d)"
trap 'rm -rf "${TEST_ROOT}"' EXIT

DIST_DIR="${TEST_ROOT}/dist"
TARGET_DIR="${TEST_ROOT}/target"

mkdir -p \
  "${DIST_DIR}/assets" \
  "${TARGET_DIR}/assets" \
  "${TEST_ROOT}/tmp"
printf 'new release\n' > "${DIST_DIR}/index.html"
printf 'new asset\n' > "${DIST_DIR}/assets/new-release.js"
printf 'old release\n' > "${TARGET_DIR}/index.html"
printf 'old asset\n' > "${TARGET_DIR}/assets/old-release.js"

FAKE_RSYNC="${TEST_ROOT}/fail-rsync.sh"
cat > "${FAKE_RSYNC}" <<'EOF'
#!/usr/bin/env bash
if [[ "$*" == *"assets/"* ]]; then
  exit 20
fi
exec rsync "$@"
EOF
chmod +x "${FAKE_RSYNC}"

ln -sf "${FAKE_RSYNC}" "${TEST_ROOT}/rsync"

if PATH="${TEST_ROOT}:${PATH}" \
  DIST_DIR="${DIST_DIR}" \
  DEPLOY_LOCAL_TARGET="${TARGET_DIR}" \
  DEPLOY_SKIP_ORIGIN_VERIFY=1 \
  bash "${ROOT_DIR}/scripts/deploy-ssh.sh"; then
  echo "Expected the simulated asset transfer to fail." >&2
  exit 1
fi

if [[ "$(tr -d '\n' < "${TARGET_DIR}/index.html")" != "old release" ]]; then
  echo "Interrupted deployment replaced the live HTML." >&2
  exit 1
fi

if [[ ! -f "${TARGET_DIR}/assets/old-release.js" ]]; then
  echo "Interrupted deployment deleted a previous release asset." >&2
  exit 1
fi

echo "Deployment safety test passed: failed asset uploads preserve the live release."

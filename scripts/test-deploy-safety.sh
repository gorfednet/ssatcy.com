#!/usr/bin/env bash
set -Eeuo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TEST_ROOT="$(mktemp -d)"
trap 'rm -rf "${TEST_ROOT}"' EXIT

grep -q -- 'nas_ssh_ensure_readable_files "${!#}"' \
  "${ROOT_DIR}/scripts/deploy-ssh.sh" ||
  {
    echo "Remote deploys must repair deploy-owned file readability." >&2
    exit 1
  }

fail() {
  echo "$1" >&2
  exit 1
}

file_mode() {
  if stat -f '%Lp' "$1" >/dev/null 2>&1; then
    stat -f '%Lp' "$1"
  else
    stat -c '%a' "$1"
  fi
}

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
mkdir -p "${TEST_ROOT}/tmp/ssatcy-com-deploy.lock"
printf '999999\n' > "${TEST_ROOT}/tmp/ssatcy-com-deploy.lock/pid"

REAL_RSYNC="$(command -v rsync)"
FAKE_RSYNC="${TEST_ROOT}/fail-rsync.sh"
cat > "${FAKE_RSYNC}" <<'EOF'
#!/usr/bin/env bash
if [[ "$*" == *"assets/"* ]]; then
  exit 20
fi
exec "${REAL_RSYNC}" "$@"
EOF
chmod +x "${FAKE_RSYNC}"
ln -sf "${FAKE_RSYNC}" "${TEST_ROOT}/rsync"

if PATH="${TEST_ROOT}:${PATH}" \
  REAL_RSYNC="${REAL_RSYNC}" \
  TMPDIR="${TEST_ROOT}/tmp" \
  DIST_DIR="${DIST_DIR}" \
  DEPLOY_LOCAL_TARGET="${TARGET_DIR}" \
  DEPLOY_SKIP_ORIGIN_VERIFY=1 \
  bash "${ROOT_DIR}/scripts/deploy-ssh.sh"; then
  fail "Expected the simulated asset transfer to fail."
fi

if [[ "$(tr -d '\n' < "${TARGET_DIR}/index.html")" != "old release" ]]; then
  fail "Interrupted deployment replaced the live HTML."
fi

if [[ ! -f "${TARGET_DIR}/assets/old-release.js" ]]; then
  fail "Interrupted deployment deleted a previous release asset."
fi

PERMS_DIST_DIR="${TEST_ROOT}/perms-dist"
PERMS_TARGET_DIR="${TEST_ROOT}/perms-target"
mkdir -p \
  "${PERMS_DIST_DIR}/assets/private" \
  "${PERMS_DIST_DIR}/content/child" \
  "${PERMS_TARGET_DIR}" \
  "${TEST_ROOT}/perms-tmp"

printf 'new release\n' > "${PERMS_DIST_DIR}/index.html"
printf 'restricted asset\n' > "${PERMS_DIST_DIR}/assets/private/restricted.js"
printf 'restricted content\n' > "${PERMS_DIST_DIR}/content/child/restricted.txt"
chmod 0600 \
  "${PERMS_DIST_DIR}/index.html" \
  "${PERMS_DIST_DIR}/assets/private/restricted.js" \
  "${PERMS_DIST_DIR}/content/child/restricted.txt"
chmod 0700 \
  "${PERMS_DIST_DIR}/assets" \
  "${PERMS_DIST_DIR}/assets/private" \
  "${PERMS_DIST_DIR}/content" \
  "${PERMS_DIST_DIR}/content/child"

for route in bio music film games live gallery contact; do
  mkdir -p "${PERMS_DIST_DIR}/${route}" "${PERMS_TARGET_DIR}/${route}"
  printf '%s route\n' "${route}" > "${PERMS_DIST_DIR}/${route}/index.html"
  chmod 0600 "${PERMS_DIST_DIR}/${route}/index.html"
  chmod 0700 "${PERMS_DIST_DIR}/${route}"
done

chmod 0711 "${PERMS_TARGET_DIR}"
target_root_mode_before="$(file_mode "${PERMS_TARGET_DIR}")"

TMPDIR="${TEST_ROOT}/perms-tmp" \
DIST_DIR="${PERMS_DIST_DIR}" \
DEPLOY_LOCAL_TARGET="${PERMS_TARGET_DIR}" \
DEPLOY_SKIP_ORIGIN_VERIFY=1 \
bash "${ROOT_DIR}/scripts/deploy-ssh.sh"

[[ "$(file_mode "${PERMS_TARGET_DIR}")" == "${target_root_mode_before}" ]] ||
  fail "Deployment changed the existing target root mode."
[[ "$(file_mode "${PERMS_TARGET_DIR}/index.html")" == "644" ]] ||
  fail "Root HTML was not normalized to mode 0644."
[[ "$(file_mode "${PERMS_TARGET_DIR}/assets/private/restricted.js")" == "644" ]] ||
  fail "Restrictive asset was not normalized to mode 0644."
[[ "$(file_mode "${PERMS_TARGET_DIR}/content/child/restricted.txt")" == "644" ]] ||
  fail "Restrictive non-asset file was not normalized to mode 0644."
[[ "$(file_mode "${PERMS_TARGET_DIR}/assets/private")" == "755" ]] ||
  fail "Transferred asset child directory was not normalized to mode 0755."
[[ "$(file_mode "${PERMS_TARGET_DIR}/content/child")" == "755" ]] ||
  fail "Transferred content child directory was not normalized to mode 0755."

echo "Deployment safety tests passed: interrupted uploads preserve the live release and restrictive source modes are normalized."

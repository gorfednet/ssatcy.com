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

if DIST_DIR="${DIST_DIR}" \
  DEPLOY_LOCAL_TARGET="${TARGET_DIR}" \
  DEPLOY_SKIP_ORIGIN_VERIFY=1 \
  DEPLOY_FAIL_AFTER_STAGE=1 \
  bash "${ROOT_DIR}/scripts/deploy-ssh.sh"; then
  echo "Expected the simulated staged deployment to fail." >&2
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

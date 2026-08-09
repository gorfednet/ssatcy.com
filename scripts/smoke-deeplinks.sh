#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BASE_URL="${1:-https://ssatcy.com}"

exec node "${ROOT_DIR}/scripts/verify-production.mjs" \
  --base-url "${BASE_URL}" \
  --dist "${ROOT_DIR}/dist"

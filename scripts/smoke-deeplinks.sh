#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${1:-https://ssatcy.com}"
BASE_URL="${BASE_URL%/}"
PATHS=("/" "/bio" "/music" "/film" "/games" "/live" "/gallery" "/contact")

echo "Running deep-link smoke test against ${BASE_URL}"

for path in "${PATHS[@]}"; do
  url="${BASE_URL}${path}"
  status="$(curl -sSL -o /dev/null -w '%{http_code}' "${url}")"
  if [[ "${status}" != "200" ]]; then
    echo "FAIL ${url} -> HTTP ${status}"
    exit 1
  fi
  echo "OK   ${url} -> HTTP ${status}"
done

echo "Deep-link smoke test passed."

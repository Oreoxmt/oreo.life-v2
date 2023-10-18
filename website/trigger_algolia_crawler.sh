#!/bin/bash

set -e

echo "Triggering Algolia crawler..."

test -z "$GITHUB_WORKFLOW_DISPATCH" && echo "Preview mode, exiting..." && exit 0

curl -L \
  -X POST \
  -H "Accept: application/vnd.github+json" \
  -H "Authorization: Bearer ${GITHUB_TOKEN}" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  "${GITHUB_WORKFLOW_DISPATCH}" \
  -d '{"ref":"main"}'

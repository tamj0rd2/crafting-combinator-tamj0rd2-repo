#!/usr/bin/env bash

set -eo pipefail

mod_dir=".release"

rm -rf "${mod_dir}"
npm run build
cp mod_info.json "${mod_dir}/info.json"

echo "Built successfully"

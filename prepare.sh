#!/usr/bin/env bash

set -eo pipefail

mod_dir="../tamj0rd2-crafting-combinator"

rm -rf "${mod_dir}"
npm run build
cp mod_info.json "${mod_dir}/info.json"

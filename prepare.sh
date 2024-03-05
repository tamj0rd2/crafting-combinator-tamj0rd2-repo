#!/usr/bin/env bash

set -eo pipefail

mod_dir="../crafting-combinator-tamj0rd2"

rm -rf "${mod_dir}"
npm run build
cp mod_info.json "${mod_dir}/info.json"

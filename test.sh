#!/usr/bin/env bash

set -e
set -o pipefail

./build.sh
mod_name="crafting-combinator-tamj0rd2"
repo_dir=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

npx factorio-test run --mod-name "${mod_name}" --data-directory "${repo_dir}/.factorio-test-data"

echo "Tests completed successfully :)"

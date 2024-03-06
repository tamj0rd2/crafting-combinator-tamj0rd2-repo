#!/usr/bin/env bash

set -e
set -o pipefail

./build.sh
mod_name="crafting-combinator-tamj0rd2"
repo_dir=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
mods_directory="${repo_dir}/.factorio-test-data/mods"
mod_directory="${mods_directory}/${mod_name}"

rm -rf "${mod_directory:?}"
mkdir -p "${mods_directory}"
cp -r "${repo_dir}/.release" "${mod_directory}"

npx factorio-test run "${repo_dir}/.release" --data-directory "${repo_dir}/.factorio-test-data"

echo "Tests completed successfully :)"

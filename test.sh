#!/usr/bin/env bash

set -eo pipefail

./build.sh
mod_name="crafting-combinator-tamj0rd2"
repo_dir=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
mods_directory="${repo_dir}/.factorio-test-data/mods"

rm -rf "${mods_directory:?}/${mod_name:?}"
cp -r "${repo_dir}/.release" "${mods_directory}/${mod_name}"

factorio_folder="$(cd "$(dirname "$repo_dir/../../..")"; pwd)"
npx factorio-test run --mod-name ${mod_name} --factorio-path "${factorio_folder}/bin/x64/factorio.exe" --data-directory "${repo_dir}/.factorio-test-data"

echo "Tests completed successfully :)"
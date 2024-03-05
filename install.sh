#!/usr/bin/env bash

set -eo pipefail

echo "${BASH_SOURCE[0]}"
repo_dir=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
mods_folder="${MODS_FOLDER:-${repo_dir}/../}"
installation_dir="${mods_folder}/crafting-combinator-tamj0rd2"

./build.sh
rm -rf "${installation_dir}"
cp -r .release "${installation_dir}"

echo "Installed mod to ${installation_dir}"

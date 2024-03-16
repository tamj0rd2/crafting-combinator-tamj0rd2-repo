#!/usr/bin/env bash

set -eo pipefail

repo_dir=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
mod_dir="${repo_dir:?}/.release"
linked_folder="${repo_dir:?}/.factorio-test-data/mods/crafting-combinator-tamj0rd2"

rm -rf "${mod_dir:?}"/*
npm run build
cp mod/mod_info.json "${mod_dir}/info.json"
cp -r mod/locale "${mod_dir}"

mkdir -p ".factorio-test-data/mods"

#don't create a symlink if there's one already
if [ ! -L "${linked_folder}" ] && [ ! -e "${linked_folder}" ]; then
  ln -s "${mod_dir:?}" "${linked_folder:?}"
fi

echo "Built successfully"

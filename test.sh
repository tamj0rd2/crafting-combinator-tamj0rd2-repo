#!/usr/bin/env bash

set -eo pipefail

script_dir=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
factorio_folder="$(cd "$(dirname "$script_dir/../../..")"; pwd)"

npx factorio-test run --mod-name tamj0rd2-crafting-combinator --factorio-path "${factorio_folder}/bin/x64/factorio.exe" -d "${factorio_folder}"

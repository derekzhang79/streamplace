#!/bin/bash

set -o errexit
set -o nounset
set -o pipefail

ROOT="$( cd "$( dirname "${BASH_SOURCE[0]}" )"/.. && pwd )"
source "$ROOT/run/common.sh"

info "Linting $PACKAGE_NAME"

# Have helm lint the chart
if [[ -f "Chart.yaml" ]]; then
  log "Running helm lint ."
  helm lint .
fi

# Check to make sure all versions are correct
correctVersion=$(cat $ROOT/lerna.json | jq -r '.version')
correctName="$PACKAGE_NAME"

if [[ -f "package.json" ]]; then
  newPackage="$(cat package.json)"
  packageVersion=$(echo $newPackage | jq -r .version)
  packageName=$(echo $newPackage | jq -r .name)
  if [[ "$packageVersion" != "$correctVersion" ]]; then
    fixOrErr "$PACKAGE_NAME: package.json has version $packageVersion instead of $correctVersion"
    newPackage=$(tweak "$newPackage" ".version" "$correctVersion")
  fi
  if [[ "$packageName" != "$correctName" ]]; then
    fixOrErr "$correctName: package.json has name $packageName instead of $correctName"
    newPackage=$(tweak "$newPackage" ".name" "$correctName")
  fi
  echo "$newPackage" > package.json
fi

if [[ -f "Chart.yaml" ]]; then
  newChart="$(cat Chart.yaml | js-yaml)"
  chartVersion="$(echo $newChart | jq -r .version)"
  chartName="$(echo $newChart | jq -r .name)"
  if [[ "$chartVersion" != "$correctVersion" ]]; then
    fixOrErr "$correctName: Chart.yaml has version $chartVersion instead of $correctVersion"
    newChart=$(tweak "$newChart" ".version" "$correctVersion")
  fi
  if [[ "$chartName" != "$correctName" ]]; then
    fixOrErr "$correctName: Chart.yaml has name $chartName instead of $correctName"
    newChart=$(tweak "$newChart" ".name" "$correctName")
  fi
  if [[ -f "package.json" ]]; then
    packageDesc="$(cat package.json | jq -r .description)"
    chartDesc="$(echo $newChart | jq -r ".description")"
    if [[ "$packageDesc" != "$chartDesc" ]]; then
      fixOrErr "$correctName Chart.yaml and package.json have different descriptions"
      newChart=$(tweak "$newChart" ".description" "$packageDesc")
    fi
  fi
  echo "$newChart" | js-yaml > Chart.yaml
fi

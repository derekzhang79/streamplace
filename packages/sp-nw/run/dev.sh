#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )"/.. && pwd )"

function finish {
  kill $BABEL
  kill $NW
  rm -f "$DIR/output.sock"
  wait $BABEL
  wait $NW
  exit 0
}
trap finish EXIT

babel -d dist src
babel --watch -d dist src &
BABEL=$!

export URL="https://streamplace.github.io/demo-video/"
export SELECTOR="canvas"

while true; do
  nw --enable-node-worker "$DIR" &
  NW=$!
  wait $NW
done

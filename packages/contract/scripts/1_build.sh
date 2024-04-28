#!/bin/bash

# set these in your .bashrc or .zshrc accoridng to: https://docs.coreum.dev/docs/tutorials/get-started/setup-cli

# export COREUM_CHAIN_ID="{Chain ID}"
# export COREUM_DENOM="{Denom}"
# export COREUM_NODE="{RPC URL}"
# export COREUM_VERSION="{Cored version}"

# export COREUM_CHAIN_ID_ARGS="--chain-id=$COREUM_CHAIN_ID"
# export COREUM_NODE_ARGS="--node=$COREUM_NODE"

# export COREUM_HOME=$HOME/.core/"$COREUM_CHAIN_ID"

# export COREUM_BINARY_NAME=$(arch | sed s/aarch64/cored-linux-arm64/ | sed s/x86_64/cored-linux-amd64/)


# builds the contract code inside of the container
docker run --rm -v "$(pwd)":/code \                           
  --mount type=volume,source="$(basename "$(pwd)")_cache",target=/target \
  --mount type=volume,source=registry_cache,target=/usr/local/cargo/registry \
  cosmwasm/optimizer:0.15.0

# result is in ./artefacts/coredin.wasm
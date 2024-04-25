#!/bin/bash

# deploys the already built contract to the $COREUM_CHAIN_ID_ARGS (should be testnet-1 for developement)

# assumes a funded wallet called "my_local_dev_wallet" has been imported to the CLI

RES=$(cored tx wasm store artifacts/coredin.wasm \
    --from my_local_dev_wallet --gas auto --gas-adjustment 1.3 -y -b block --output json $COREUM_NODE_ARGS $COREUM_CHAIN_ID_ARGS)
echo $RES
CODE_ID=$(echo $RES | jq -r '.logs[0].events[-1].attributes[-1].value')
echo $CODE_ID
#!/bin/bash


# generates a new wallet called "my_local_dev_wallet" on $COREUM_CHAIN_ID (should be coreum-testnet-1 for dev purposes)

# cored keys add <name-of-the-key> --chain-id=$COREUM_CHAIN_ID
cored keys add my_local_dev_wallet $COREUM_CHAIN_ID_ARGS

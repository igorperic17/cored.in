import { useWrappedClientContext } from "@/contexts/client";
import { IClientContext } from "@/hooks";
import { Box, Flex, Text } from "@chakra-ui/react";
import { CoredinClient, CoredinQueryClient, GetDIDResponse } from "@coredin/shared/src/coreum/contract-ts";
import { useEffect } from "react";
import { Outlet, ScrollRestoration } from "react-router-dom";

export const AppRoot = () => {
  const { 
    walletAddress,
    signingClient,
    coreumQueryClient
  } : IClientContext = useWrappedClientContext();
  // const isConnected = walletAddress.length;

  useEffect(() => {
    coreumQueryClient?.getWalletDID({ wallet: walletAddress }).then((registered_did: GetDIDResponse) => {
      console.log(registered_did);

      // try registering a dummy DID if none exists
      if (registered_did.did_info === null) {
        console.log("No DID found associated with the current wallet, registering a new one.");
        signingClient?.register({
          did: "my_awesome_did",
          username: "my_amazing_cool_new_username"
        }).then((result) => {
          console.log(result);
        });
      }
    })

  }, [walletAddress]);
  
  return (
    <Flex direction="column" justify="start">
      <Box id="detail" overflowX="hidden" flex="1">
        <Outlet />
        <ScrollRestoration />
  
      </Box>
    </Flex>
  );
};

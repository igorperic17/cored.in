import { IClientContext, useAuth, useLoggedInServerState } from "@/hooks";
import { useWrappedClientContext } from "@/contexts/client";
import { USER_QUERIES } from "@/queries";
import { Box, Text } from "@chakra-ui/layout";
import { DidInfo, GetDIDResponse } from "@coredin/shared";
import { useEffect, useState } from "react";
import { Input, Button } from "@chakra-ui/react";

export const Profile = () => {
  const { walletAddress, signingClient, coreumQueryClient }: IClientContext =
    useWrappedClientContext();
  const { needsAuth } = useAuth();
  const { data: userProfile } = useLoggedInServerState(
    USER_QUERIES.getUser(walletAddress, needsAuth),
    {
      enabled: walletAddress.length > 0
    }
  );
  const [onchainProfile, setOnchainProfile] = useState<DidInfo | null>(null);
  const [usernameInput, setUsernameInput] = useState<string>();

  useEffect(() => {
    coreumQueryClient
      ?.getWalletDID({ wallet: walletAddress })
      .then((registered_did: GetDIDResponse) => {
        console.log(registered_did);
        if (registered_did.did_info) {
          setOnchainProfile(registered_did.did_info);
        }
      });
  }, [walletAddress]);

  const registerProfile = () => {
    if (onchainProfile === null && userProfile && usernameInput) {
      console.log("Registering profile onchain...", userProfile.did);
      signingClient
        ?.register({
          did: userProfile.did,
          username: usernameInput
        })
        .then((result) => {
          console.log(result);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  return (
    <Box>
      {walletAddress && (
        <Text color="brand.500">{`Welcome to cored.in, ${walletAddress}!`}</Text>
      )}
      {!onchainProfile && userProfile && (
        <Box>
          <Text
            color="brand.500"
            textOverflow="ellipsis"
            whiteSpace="nowrap"
            overflow="hidden"
            maxW="500px"
          >{`Here's your new DID: ${userProfile.did}`}</Text>
          <Input
            placeholder="Username"
            onChange={(e) => setUsernameInput(e.target.value)}
            value={usernameInput}
          />
          <Button onClick={registerProfile}>REGISTER</Button>
        </Box>
      )}
      {onchainProfile && (
        <Text
          color="brand.500"
          textOverflow="ellipsis"
          whiteSpace="nowrap"
          overflow="hidden"
          maxW="500px"
        >{`Thanks for registering ${onchainProfile.username}! DID: ${onchainProfile.did}`}</Text>
      )}
    </Box>
  );
};

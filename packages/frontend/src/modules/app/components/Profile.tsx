import { IClientContext, useAuth, useLoggedInServerState } from "@/hooks";
import { useWrappedClientContext } from "@/contexts/client";
import { USER_QUERIES } from "@/queries";
import { Box, Center } from "@chakra-ui/layout";
import { DidInfo, GetDIDResponse } from "@coredin/shared";
import { useEffect, useState } from "react";
import {
  NotRegisteredProfile,
  RegisteredProfile,
  RequireWalletConnection
} from ".";
import { Spinner } from "@chakra-ui/spinner";

export const Profile = () => {
  const { walletAddress, signingClient, coreumQueryClient }: IClientContext =
    useWrappedClientContext();
  const { needsAuth } = useAuth();
  const { data: userProfile, isLoading } = useLoggedInServerState(
    USER_QUERIES.getUser(walletAddress, needsAuth),
    {
      enabled: walletAddress.length > 0
    }
  );
  const [onchainProfile, setOnchainProfile] = useState<DidInfo | null>(null);
  const [usernameInput, setUsernameInput] = useState<string>("");

  const updateOnchainProfile = () => {
    if (walletAddress) {
      coreumQueryClient
        ?.getWalletDID({ wallet: walletAddress })
        .then((registered_did: GetDIDResponse) => {
          console.log(registered_did);
          if (registered_did.did_info) {
            setOnchainProfile(registered_did.did_info);
          }
        });
    } else {
      setOnchainProfile(null);
    }
  };

  useEffect(updateOnchainProfile, [walletAddress]);

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
          updateOnchainProfile();
        })
        .catch((error) => {
          console.log("error while registering");
          console.error(error);
          updateOnchainProfile();
        });
    }
  };

  const handleChangeUserName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Check if the input contains only letters (uppercase and lowercase)
    if (/^[a-zA-Z]+$/.test(value) || value === "") {
      setUsernameInput(value);
    }
  };

  return (
    <Box>
      {!onchainProfile && isLoading && (
        <Center mt="32px">
          <Spinner size="xl" color="brand.500" />
        </Center>
      )}
      {!walletAddress && <RequireWalletConnection />}
      {onchainProfile && (
        <RegisteredProfile
          did={onchainProfile.did}
          username={onchainProfile.username}
        />
      )}
      {!onchainProfile && userProfile && (
        <NotRegisteredProfile
          did={userProfile.did}
          handleChangeUserName={handleChangeUserName}
          usernameInput={usernameInput}
          registerProfile={registerProfile}
        />
      )}
    </Box>
  );
};

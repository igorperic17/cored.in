import { IClientContext, useAuth, useLoggedInServerState } from "@/hooks";
import { useWrappedClientContext } from "@/contexts/client";
import { USER_QUERIES } from "@/queries";
import { Box } from "@chakra-ui/layout";
import { DidInfo, GetDIDResponse } from "@coredin/shared";
import { useEffect, useState } from "react";
import { RegisteredProfile } from "./RegisteredProfile";
import { NotRegisteredProfile } from "./NotRegisteredProfile";

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
  const [usernameInput, setUsernameInput] = useState<string>("");

  useEffect(() => {
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

  const handleChangeUserName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Check if the input contains only letters (uppercase and lowercase)
    if (/^[a-zA-Z]+$/.test(value) || value === "") {
      setUsernameInput(value);
    }
  };

  return (
    <Box>
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

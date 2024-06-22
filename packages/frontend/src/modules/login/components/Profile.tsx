import { useAuth, useLoggedInServerState } from "@/hooks";
import { USER_QUERIES } from "@/queries";
import { Box, Center } from "@chakra-ui/layout";
import { DidInfo, GetDIDResponse, TESTNET_CHAIN_NAME } from "@coredin/shared";
import { useContext, useEffect, useState } from "react";
import { RequireWalletConnection } from "../../home/components";
import { Spinner } from "@chakra-ui/spinner";
import { CoredinClientContext } from "@/contexts/CoredinClientContext";
import { useChain } from "@cosmos-kit/react";
import { Navigate, useSearchParams } from "react-router-dom";
import { NotRegisteredProfile } from ".";
import { ROUTES } from "@/router/routes";

export const Profile = () => {
  const chainContext = useChain(TESTNET_CHAIN_NAME);
  const [queryParams] = useSearchParams();
  const coredinClient = useContext(CoredinClientContext);
  const { needsAuth } = useAuth();
  const { data: userProfile, isLoading } = useLoggedInServerState(
    USER_QUERIES.getUser(chainContext.address || "", needsAuth),
    {
      enabled: !!chainContext.address
    }
  );
  const [onchainProfile, setOnchainProfile] = useState<DidInfo | null>(null);
  const [usernameInput, setUsernameInput] = useState<string>("");

  const updateOnchainProfile = () => {
    if (chainContext.address) {
      console.log("getting onchain profile");
      coredinClient
        ?.getWalletDID({ wallet: chainContext.address })
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

  useEffect(updateOnchainProfile, [
    chainContext.address,
    chainContext.isWalletConnected,
    coredinClient
  ]);

  const registerProfile = () => {
    if (onchainProfile === null && userProfile && usernameInput.length > 2) {
      console.log("Registering profile onchain...", userProfile.did);
      coredinClient
        ?.register({
          did: userProfile.did,
          username: usernameInput
        })
        .then((result) => {
          console.log(result);
          updateOnchainProfile();
          // TODO - update backend user profile with username
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
    if ((/^[a-zA-Z0-9]+$/.test(value) || value === "") && value.length <= 64) {
      setUsernameInput(value);
    }
  };

  return (
    <Box>
      {(!onchainProfile || isLoading) && (
        <Center mt="32px">
          <Spinner size="xl" color="brand.500" />
        </Center>
      )}
      {!chainContext.address && <RequireWalletConnection />}
      {!onchainProfile && userProfile && (
        <NotRegisteredProfile
          did={userProfile.did}
          handleChangeUserName={handleChangeUserName}
          usernameInput={usernameInput}
          registerProfile={registerProfile}
        />
      )}
      {onchainProfile && chainContext.isWalletConnected && userProfile && (
        <Navigate
          to={
            queryParams.get("redirect") ??
            (userProfile.username === "no_username"
              ? ROUTES.SETTINGS.path
              : ROUTES.HOME.path)
          }
        />
      )}
    </Box>
  );
};

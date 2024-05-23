/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useState } from "react";
import { authService, persistentStorageService } from "@/dependencies";
import {
  MaxLoginDurationMs,
  LoginMessage,
  getAuthKey,
  EventTypes
} from "../constants";
import { TESTNET_CHAIN_NAME } from "@coredin/shared";
import { useChain } from "@cosmos-kit/react";

export const useAuth = () => {
  const chainContext = useChain(TESTNET_CHAIN_NAME);
  const walletAddress = chainContext.address ?? "";

  const [needsAuth, setNeedsAuth] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const authenticate = useCallback(async () => {
    if (isAuthenticating) {
      return;
    }

    if (chainContext.address) {
      setIsAuthenticating(true);

      try {
        const expiration = Date.now() + MaxLoginDurationMs;
        const message = LoginMessage + expiration;
        const signedMessage = await chainContext.signArbitrary(
          walletAddress,
          message
        );
        const token = await authService.authenticate(
          walletAddress,
          signedMessage.pub_key.value,
          signedMessage.signature,
          expiration
        );
        const authKey = getAuthKey(walletAddress);
        persistentStorageService.save(authKey, token);

        setNeedsAuth(false);
      } catch (e) {
        console.error(e);
      }
    }

    setIsAuthenticating(false);
  }, [walletAddress, isAuthenticating]);

  useEffect(() => {
    const handleUnauthorizedRequest = () => {
      setNeedsAuth(true);
      authenticate();
    };
    document.addEventListener(
      EventTypes.UNAUTHORIZED_API_REQUEST,
      handleUnauthorizedRequest
    );

    return () => {
      document.removeEventListener(
        EventTypes.UNAUTHORIZED_API_REQUEST,
        handleUnauthorizedRequest
      );
    };
  }, [authenticate]);

  return { needsAuth, isAuthenticating, authenticate: () => {} };
};

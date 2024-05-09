/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useState } from "react";
import { authService, persistentStorageService } from "@/dependencies";
import {
  MaxLoginDurationMs,
  LoginMessage,
  getAuthKey,
  EventTypes
} from "../constants";
import { useWrappedClientContext } from "@/contexts/client";
import { TESTNET_CHAIN_ID } from "@coredin/shared";

// extend window with CosmJS and Keplr properties
interface CosmosKeplrWindow extends Window {
  wallet: any;
}

declare let window: CosmosKeplrWindow;

export const useAuth = () => {
  const { walletAddress } = useWrappedClientContext();
  const [needsAuth, setNeedsAuth] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const authenticate = useCallback(async () => {
    if (isAuthenticating) {
      return;
    }

    if (walletAddress.length && window.wallet) {
      setIsAuthenticating(true);

      try {
        const expiration = Date.now() + MaxLoginDurationMs;
        const message = LoginMessage + expiration;
        const signedMessage = await window.wallet.signArbitrary(
          TESTNET_CHAIN_ID,
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

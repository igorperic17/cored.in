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

const loginExpirationMarginMs = 5 * 60 * 1000; // 5 minutes

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
        const expiration =
          Date.now() + MaxLoginDurationMs - loginExpirationMarginMs;
        const message = LoginMessage + expiration;
        const signedMessage = await chainContext.signArbitrary(
          walletAddress,
          message
        );

        // Type from CosmJS
        // export interface StdSignature {
        //   readonly pub_key: Pubkey;
        //   readonly signature: string;
        // }
        // Return type from leap
        // {
        //   pub_key: Pubkey;
        //   signature: {
        //     signature: {
        //       signature: "actual signature"
        //       pub_key: Pubkey;
        //     },
        //     signed: {...}
        //   }
        // }

        const pub_key = signedMessage.pub_key.value;
        const signature =
          chainContext.wallet?.name === "leap-capsule-social-login"
            ? (signedMessage as any).signature.signature.signature
            : signedMessage.signature;

        const token = await authService.authenticate(
          walletAddress,
          pub_key,
          signature,
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

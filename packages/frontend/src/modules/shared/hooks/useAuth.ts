import { useCallback, useEffect, useState } from "react";
import { authService, persistentStorageService } from "@/dependencies";
import {
  MaxLoginDurationMs,
  LoginMessage,
  getAuthKey,
  EventTypes
} from "../constants";

export const useAuth = () => {
  const [needsAuth, setNeedsAuth] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // TODO - adapt to cosmos wallet!

  // const authenticate = useCallback(async () => {
  //   if (isAuthenticating) {
  //     return;
  //   }

  //   if (isConnected && address) {
  //     setIsAuthenticating(true);

  //     try {
  //       const expiration = Date.now() + MaxLoginDurationMs;
  //       const message = LoginMessage + expiration;
  //       const signedMessage = await signMessageAsync({ message });
  //       const token = await authService.authenticate(signedMessage, expiration);
  //       const authKey = getAuthKey(address);
  //       persistentStorageService.save(authKey, token);

  //       setNeedsAuth(false);
  //     } catch (e) {
  //       console.error(e);
  //     }
  //   }

  //   setIsAuthenticating(false);
  // }, [address, isAuthenticating, signMessageAsync]);

  // useEffect(() => {
  //   const handleUnauthorizedRequest = (e: Event) => {
  //     setNeedsAuth(true);
  //     // authenticate();
  //   };
  //   document.addEventListener(
  //     EventTypes.UNAUTHORIZED_API_REQUEST,
  //     handleUnauthorizedRequest
  //   );

  //   return () => {
  //     document.removeEventListener(
  //       EventTypes.UNAUTHORIZED_API_REQUEST,
  //       handleUnauthorizedRequest
  //     );
  //   };
  // }, [authenticate]);

  return { needsAuth, isAuthenticating, authenticate: () => {} };
};

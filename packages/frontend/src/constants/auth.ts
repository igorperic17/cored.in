export const ConnectedWalletKey = "connectedWallet";
export const LoginMessage = "Welcome to Coredin! Login expiration:"; // TODO - move to shared package between back / front
export const MaxLoginDurationMs = 60 * 60 * 1000; // 1h // TODO - move to shared package between back / front

export enum EventTypes {
  UNAUTHORIZED_API_REQUEST = "UnauthorizedAPIRequest"
}

export const makeUnauthorizedAPIRequestEvent = (args?: Record<string, any>) => {
  return new CustomEvent(EventTypes.UNAUTHORIZED_API_REQUEST, {
    detail: args ?? {}
  });
};

export const getAuthKey = (walletAddress: string): string => {
  return `wallet:${walletAddress.toLowerCase()}-auth`;
};

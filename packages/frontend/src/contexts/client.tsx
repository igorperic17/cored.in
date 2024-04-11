import { createContext, ReactNode, useContext } from "react";
import { IClientContext, useClientContext } from "@/hooks";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let ClientContext: any;
const { Provider } = (ClientContext = createContext<IClientContext>({
  walletAddress: "",
  auth: null,
  signingClient: null,
  coreumQueryClient: null,
  // contractClient: null,
  loading: false,
  error: null,
  connectWallet: () => {},
  disconnect: () => {},
  requestedProfile: {
    walletAddress: null,
    setRequestedProfileWalletAddress: () => {}
  }
  // backendService: {} as BackendService
}));

export const useWrappedClientContext = (): IClientContext =>
  useContext(ClientContext);

export const SigningClientProvider = ({
  children
}: {
  children: ReactNode;
}) => {
  const value = useClientContext();
  return <Provider value={value}>{children}</Provider>;
};

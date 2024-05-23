import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";
import { router } from "./router/router";
import { FeatureFlagContextProvider } from "./contexts/featureFlag";
import { ChainProvider } from "@cosmos-kit/react";
import { wallets as keplrWallets } from "@cosmos-kit/keplr-extension";
import { wallets as leapWallets } from "@cosmos-kit/leap";
import { wallets as cosmostationWallets } from "@cosmos-kit/cosmostation";
import { assets, chain } from "chain-registry/testnet/coreumtestnet";
import CoredinClientContextProvider from "./contexts/CoredinClientContextProvider";

function App() {
  const queryClient = new QueryClient();

  return (
    <FeatureFlagContextProvider>
      <ChainProvider
        chains={[chain]}
        assetLists={[assets]}
        wallets={[...keplrWallets, ...leapWallets, ...cosmostationWallets]}
        walletConnectOptions={{
          signClient: {
            projectId: "123",
            relayUrl: "wss://relay.walletconnect.org",
            metadata: {
              name: "cored.in",
              description: "cored.in main site",
              url: "https://www.cored.in",
              icons: []
            }
          }
        }}
      >
        <QueryClientProvider client={queryClient}>
          <CoredinClientContextProvider>
            <RouterProvider router={router} />º
          </CoredinClientContextProvider>
        </QueryClientProvider>
      </ChainProvider>
    </FeatureFlagContextProvider>
  );
}

export default App;

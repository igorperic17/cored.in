import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";
import { router } from "./router/router";
import { ChainProvider } from "@cosmos-kit/react";
import { wallets as keplrWallets } from "@cosmos-kit/keplr-extension";
import { wallets as leapWallets } from "@cosmos-kit/leap";
import { wallets as cosmostationWallets } from "@cosmos-kit/cosmostation";
import { assets, chain } from "chain-registry/testnet/coreumtestnet";
import CoredinClientContextProvider from "./contexts/CoredinClientContextProvider";
import { lazy, Suspense, useEffect, useState } from "react";
import { MainWalletBase } from "@cosmos-kit/core";
// import { CustomCapsuleModalView } from "@leapwallet/cosmos-social-login-capsule-provider-ui";
import {
  CapsuleProvider,
  OAuthMethod
} from "@leapwallet/cosmos-social-login-capsule-provider";
import { Box } from "@chakra-ui/react";
import "@leapwallet/cosmos-social-login-capsule-provider-ui/styles.css";

const options = {
  env: import.meta.env.VITE_CAPSULE_ENV,
  apiKey: import.meta.env.VITE_CAPSULE_API_KEY,
  opts: {
    emailPrimaryColor: "#ff5733",
    homepageUrl: "https://cored.in",
    portalTheme: {
      backgroundColor: "#ffffff",
      foregroundColor: "#ff5733"
      // borderRadius: "lg"
    }
  }
};

// Create a new CapsuleProvider instance with the options
const capsuleProvider = new CapsuleProvider(options);

function App() {
  const queryClient = new QueryClient();

  const defaultWallets: MainWalletBase[] = [
    ...keplrWallets,
    ...leapWallets,
    ...cosmostationWallets
  ];
  const [wallets, setWallets] = useState<MainWalletBase[]>(defaultWallets);
  const [loadingWallets, setLoadingWallet] = useState<boolean>(false);

  useEffect(() => {
    setLoadingWallet(true);
    import("@cosmos-kit/leap-capsule-social-login")
      .then((CapsuleModule) => {
        return CapsuleModule.wallets;
      })
      .then((leapSocialLogin) => {
        setWallets([
          ...keplrWallets,
          ...leapWallets,
          ...cosmostationWallets,
          ...(leapSocialLogin as any[])
        ]);
        setLoadingWallet(false);
      });
  }, []);

  if (loadingWallets) {
    return <>Loading...</>;
  }

  return (
    <>
      <ChainProvider
        chains={[chain]}
        assetLists={[assets]}
        wallets={wallets}
        logLevel={"DEBUG"}
        // disableIframe={false}
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
        throwErrors={false}
        subscribeConnectEvents={false}
        defaultNameService={"stargaze"}
        endpointOptions={{
          isLazy: true,
          endpoints: {
            cosmoshub: {
              rpc: [
                {
                  url: "https://rpc.cosmos.directory/cosmoshub",
                  headers: {}
                }
              ]
            }
          }
        }}
      >
        <QueryClientProvider client={queryClient}>
          <CoredinClientContextProvider>
            <RouterProvider router={router} />
          </CoredinClientContextProvider>
        </QueryClientProvider>
      </ChainProvider>
    </>
  );
}

export default App;

// const LeapSocialLogin = lazy(() =>
//   import("@leapwallet/cosmos-social-login-capsule-provider-ui").then((m) => ({
//     default: m.CustomCapsuleModalView
//   }))
// );

// export function CustomCapsuleModalViewX() {
//   const [showCapsuleModal, setShowCapsuleModal] = useState(false);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   useEffect(() => {
//     const checkAuthStatus = async () => {
//       try {
//         await capsuleProvider.enable();
//         setIsAuthenticated(true);
//         console.log({
//           title: "Authentication Status",
//           description: "You are already authenticated."
//         });
//       } catch (error) {
//         console.log("Not authenticated:", error);
//         console.log({
//           title: "Authentication Status",
//           description: "You are not authenticated.",
//           variant: "destructive"
//         });
//       }
//     };
//     checkAuthStatus();
//   }, []);

// useEffect(() => {
//   window.openCapsuleModal = () => {
//     setShowCapsuleModal(true);
//   };
// }, []);
//   console.log(import.meta.env.VITE_CAPSULE_API_KEY);

//   return (
//     <Suspense fallback={<div>Loading...</div>}>
//       <LeapSocialLogin
//         capsule={capsuleProvider.getClient()}
//         showCapsuleModal={showCapsuleModal}
//         setShowCapsuleModal={setShowCapsuleModal}
//         appName="cored.in"
//         logoUrl="https://www.shutterstock.com/image-vector/lorem-ipsum-logo-design-consept-260nw-1456986776.jpg"
//         oAuthMethods={[
//           OAuthMethod.APPLE,
//           OAuthMethod.DISCORD,
//           OAuthMethod.FACEBOOK,
//           OAuthMethod.GOOGLE,
//           OAuthMethod.TWITTER
//         ]}
//         onAfterLoginSuccessful={() => {
//           window.successFromCapsuleModal();
//         }}
//         onLoginFailure={() => {
//           window.failureFromCapsuleModal();
//         }}
//       />
//     </Suspense>
//   );
// }

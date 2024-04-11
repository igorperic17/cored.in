import { Button } from "@chakra-ui/react";

export const Login = () => {
  //   TODO - implement from Cosmos Wallet
  const isConnected = false;
  const address = "";
  const connect = () => {};
  const disconnect = () => {};
  if (isConnected) {
    return (
      <div className="main">
        <div className="title">Connected</div>
        <div>{address}</div>
        <Button className="card" onClick={disconnect}>
          Disconnect
        </Button>
        {/* <NetworkSwitcher /> */}
      </div>
    );
  } else {
    return (
      <>
        return (
        <Button className="card" onClick={connect}>
          {`Login`}
        </Button>
        );
      </>
    );
  }
};

// const NetworkSwitcher = () => {
//   const { chain } = useNetwork();
//   const { chains, error, pendingChainId, switchNetwork, status } =
//     useSwitchNetwork();

//   return (
//     <div>
//       {chain && <div>Using {chain.name}</div>}

//       {chains.map((x) => (
//         <button
//           disabled={!switchNetwork || x.id === chain?.id}
//           key={x.id}
//           onClick={() => switchNetwork?.(x.id)}
//         >
//           Switch to {x.name}
//           {status === "loading" && x.id === pendingChainId && "…"}
//         </button>
//       ))}

//       <div>{error && (error?.message ?? "Failed to switch")}</div>
//     </div>
//   );
// };

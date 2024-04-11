import { useClientContext } from "@/hooks/useClientContext";
import { Button } from "@chakra-ui/react";

export const Login = () => {
  const { connectWallet, disconnect, walletAddress } = useClientContext();
  const isConnected = walletAddress.length;

  if (isConnected) {
    return (
      <div className="main">
        <div className="title">Connected</div>
        <div>{walletAddress}</div>
        <Button className="card" onClick={() => disconnect()}>
          Disconnect
        </Button>
        {/* <NetworkSwitcher /> */}
      </div>
    );
  } else {
    return (
      <>
        <Button className="card" onClick={connectWallet}>
          {`Login`}
        </Button>
      </>
    );
  }
};

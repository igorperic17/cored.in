import { useAuth, useLoggedInServerState } from "@/hooks";
import { useWrappedClientContext } from "@/contexts/client";
import { USER_QUERIES } from "@/queries";
import { useEffect } from "react";

export const AuthTest = () => {
  const { walletAddress, loading } = useWrappedClientContext();
  const { needsAuth, isAuthenticating, authenticate } = useAuth();
  const { data, isLoading, error, isError } = useLoggedInServerState(
    USER_QUERIES.getUser(walletAddress, needsAuth),
    { enabled: walletAddress.length > 0 }
  );

  useEffect(() => {
    console.log("data", data);
    console.log("wallet", walletAddress);
  }, [loading]);

  return (
    <div style={{ margin: "20px" }}>
      {data && <h3>Got data!!</h3>}
      {isLoading && <h3>Loading...</h3>}
      {isError && (
        <h3>
          Found error..
          {`${error}`}
        </h3>
      )}
    </div>
  );
};

import { useAuth, useLoggedInServerState } from "@/hooks";
import { useWrappedClientContext } from "@/contexts/client";
import { USER_QUERIES } from "@/queries";
import { useEffect } from "react";
import { Text } from "@chakra-ui/layout";

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
      {data && (
        <>
          <Text color="colors.brand.600">Got data!!</Text>
          <Text color="colors.brand.600">{JSON.stringify(data)}</Text>
        </>
      )}
      {isLoading && <h3>Loading...</h3>}
      {isError && (
        <Text color="colors.brand.600">
          Found error..
          {`${error}`}
        </Text>
      )}
    </div>
  );
};

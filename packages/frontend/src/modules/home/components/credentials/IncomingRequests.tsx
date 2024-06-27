import { useLoggedInServerState } from "@/hooks";
import { ISSUER_QUERIES } from "@/queries/IssuerQueries";
import { Box, Heading, Text, VStack } from "@chakra-ui/react";
import { CredentialRequestStatus } from "@coredin/shared";
import { IssuanceRequest } from "../IssuanceRequest";

export const IncomingRequests = () => {
  const { data: pendingRequests } = useLoggedInServerState(
    ISSUER_QUERIES.getRequests(CredentialRequestStatus?.PENDING || "PENDING")
  );

  return (
    <Box layerStyle="cardBox" p="1em" pb="1.5em" mb="4em">
      <Heading as="h1" fontFamily="body" mb="2.5em">
        Incoming requests: {pendingRequests?.length}
      </Heading>
      {pendingRequests?.length === 0 ? (
        <Text color="text.400">There are no pending credential requests</Text>
      ) : (
        <VStack spacing="1em" layerStyle="cardBox" align="start" w="100%">
          {pendingRequests &&
            pendingRequests.map((request, i) => (
              <IssuanceRequest
                key={`incoming-credential-request-${i}`}
                request={request}
              />
            ))}
        </VStack>
      )}
    </Box>
  );
};
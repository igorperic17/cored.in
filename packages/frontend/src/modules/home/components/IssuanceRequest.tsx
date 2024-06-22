import { BaseServerStateKeys } from "@/constants";
import { useMutableServerState } from "@/hooks";
import { CredentialRequestDTO } from "@coredin/shared";
import { useQueryClient } from "@tanstack/react-query";
import { VStack, Heading, Flex } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/react";
import { ISSUER_MUTATIONS } from "@/queries/IssuerMutations";

export type IssuanceRequestProps = {
  request: CredentialRequestDTO;
};

export const IssuanceRequest: React.FC<IssuanceRequestProps> = ({
  request
}) => {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutableServerState(
    ISSUER_MUTATIONS.acceptRequest(request.id)
  );

  const handleAccept = async () => {
    await mutateAsync({ daysValid: 30 });
    await queryClient.invalidateQueries({
      queryKey: [BaseServerStateKeys.CREDENTIAL_REQUESTS]
    });
  };

  return (
    <VStack
      spacing="1em"
      layerStyle="cardBox"
      p="1em"
      pb="1.5em"
      align="start"
      mb="4em"
    >
      <Heading as="h1" fontFamily="body">
        {request.requester.username}
      </Heading>
      <Flex direction="row" justify="space-between">
        <Heading as="h2" fontFamily="body">
          {request.credential.establishment} - {request.credential.title}
        </Heading>
      </Flex>
      <Button variant="primary" size="md" onClick={handleAccept}>
        Accept request
      </Button>
    </VStack>
  );
};

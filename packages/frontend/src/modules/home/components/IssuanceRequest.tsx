import { BaseServerStateKeys } from "@/constants";
import { useMutableServerState } from "@/hooks";
import { CredentialRequestDTO } from "@coredin/shared";
import { useQueryClient } from "@tanstack/react-query";
import {
  Button,
  VStack,
  Heading,
  HStack,
  ButtonGroup,
  Link
} from "@chakra-ui/react";
import { ISSUER_MUTATIONS } from "@/queries/IssuerMutations";
import { Link as ReactRouterLink } from "react-router-dom";
import { CredentialContent } from "./credentials";

export type IssuanceRequestProps = {
  request: CredentialRequestDTO;
};

export const IssuanceRequest: React.FC<IssuanceRequestProps> = ({
  request
}) => {
  const queryClient = useQueryClient();
  const { mutateAsync: accept, isPending: isAccepting } = useMutableServerState(
    ISSUER_MUTATIONS.acceptRequest(request.id)
  );

  const { mutateAsync: reject, isPending: isRejecting } = useMutableServerState(
    ISSUER_MUTATIONS.rejectRequest(request.id)
  );

  const handleAccept = async () => {
    await accept({ daysValid: 30 });
    await queryClient.invalidateQueries({
      queryKey: [BaseServerStateKeys.CREDENTIAL_REQUESTS]
    });
  };

  const handleReject = async () => {
    await reject({});
    await queryClient.invalidateQueries({
      queryKey: [BaseServerStateKeys.CREDENTIAL_REQUESTS]
    });
  };

  return (
    <VStack
      as="article"
      align="start"
      spacing="1.5em"
      color="text.100"
      // border="1px solid red"
      w="100%"
      py="1.5em"
      borderBottom="2px solid #3E3D3A"
      _last={{ borderBottom: "none" }}
    >
      <VStack align="start" spacing="0.75em" w="100%">
        <HStack justify="space-between" w="100%">
          <Heading
            as="h3"
            fontFamily="body"
            fontSize={{ base: "1rem", lg: "1.25rem" }}
            wordBreak="break-all"
            lineHeight="1.5"
          >
            <Link as={ReactRouterLink}>@{request.requester.username}</Link>
          </Heading>
        </HStack>
        <CredentialContent
          title={request.credential.title}
          establishment={request.credential.establishment}
          startDate={request.credential.startDate}
          endDate={request.credential.endDate}
        />
      </VStack>
      <ButtonGroup size="sm" alignSelf="end" spacing="1.5em">
        <Button
          variant="empty"
          onClick={handleReject}
          color="text.400"
          isLoading={isRejecting}
        >
          Decline
        </Button>
        <Button
          variant="primary"
          onClick={handleAccept}
          isLoading={isAccepting}
        >
          Approve
        </Button>
      </ButtonGroup>
    </VStack>
  );
};

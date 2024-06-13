import { BaseServerStateKeys } from "@/constants";
import { useMutableServerState } from "@/hooks";
import { USER_MUTATIONS } from "@/queries";
import {
  Badge,
  Box,
  Button,
  Heading,
  HStack,
  Icon,
  Link,
  Text,
  useToast,
  VStack
} from "@chakra-ui/react";
import { CredentialDTO } from "@coredin/shared";
import { useQueryClient } from "@tanstack/react-query";
import { FC } from "react";
import { FaTrash } from "react-icons/fa6";
import { Link as ReactRouterLink } from "react-router-dom";

type CredentialProps = {
  credential: CredentialDTO;
};

export const Credential: FC<CredentialProps> = ({ credential }) => {
  const { id, title, establishment, startDate, endDate, verified, issuer } =
    credential;
  const { mutateAsync } = useMutableServerState(
    USER_MUTATIONS.deleteCredential(id)
  );
  const toast = useToast();
  const queryClient = useQueryClient();

  const handleDelete = () => {
    mutateAsync({ permanent: false }).then(() => {
      toast({
        position: "top-right",
        status: "success",
        duration: 1000,
        render: () => (
          <Box
            color="text.900"
            p="1em 1.5em"
            bg="brand.500"
            borderRadius="0.5em"
          >
            Credential deleted successfully.
          </Box>
        ),
        isClosable: true
      });
      queryClient.invalidateQueries({
        queryKey: [BaseServerStateKeys.USER]
      });
    });
  };

  return (
    <VStack
      align="start"
      spacing="1em"
      borderBottom="2px solid #3E3D3A"
      _last={{ borderBottom: "none" }}
      py="1.5em"
      color={verified ? "text.100" : "text.800"}
    >
      {verified && issuer && (
        <>
          <Badge variant="verified">Verified</Badge>
        </>
      )}
      <VStack align="start" spacing="0.25em" w="100%">
        <HStack justify="space-between" w="100%">
          <Heading
            as="h3"
            fontFamily="body"
            fontSize={{ base: "1rem", lg: "1.25rem" }}
          >
            {title}
          </Heading>
          <Button
            variant="empty"
            color="text.400"
            aria-label={`Remove credential.`}
            onClick={handleDelete}
          >
            <Icon as={FaTrash} fontSize="1.5rem" />
          </Button>
        </HStack>

        <Text fontSize={{ base: "0.875rem", lg: "1rem" }}>{establishment}</Text>
        <Text fontSize={{ base: "0.875rem", lg: "1rem" }}>
          {startDate} — {endDate || "Present"}
        </Text>
      </VStack>

      {verified && issuer && (
        <Text fontSize={{ base: "0.875rem", lg: "1rem" }}>
          {`Verified by `}
          <Link as={ReactRouterLink} _hover={{ color: "brand.500" }}>
            {issuer}
          </Link>
        </Text>
      )}
    </VStack>
  );
};

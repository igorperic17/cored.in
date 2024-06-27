import { BaseServerStateKeys } from "@/constants";
import { CoredinClientContext } from "@/contexts/CoredinClientContext";
import { useMutableServerState } from "@/hooks";
import { USER_MUTATIONS } from "@/queries";
import {
  Badge,
  Box,
  Heading,
  HStack,
  IconButton,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useToast,
  VStack
} from "@chakra-ui/react";
import { CredentialDTO, TESTNET_CHAIN_NAME } from "@coredin/shared";
import { useChain } from "@cosmos-kit/react";
import { useQueryClient } from "@tanstack/react-query";
import MerkleTree from "merkletreejs";
import { FC, useContext } from "react";
import { FaEllipsis, FaTrash } from "react-icons/fa6";
import { Link as ReactRouterLink } from "react-router-dom";
import { generateProof } from "../helpers/generateProof";
import { ROUTES } from "@/router/routes";

type CredentialProps = {
  credential: CredentialDTO;
  tree: MerkleTree;
  showOptions: boolean;
};

export const Credential: FC<CredentialProps> = ({
  credential,
  tree,
  showOptions
}) => {
  const {
    id,
    title,
    subjectDid,
    establishment,
    startDate,
    endDate,
    verified,
    issuer
  } = credential;
  const chainContext = useChain(TESTNET_CHAIN_NAME);
  const coredinClient = useContext(CoredinClientContext);
  const { mutateAsync, isPending: isDeleting } = useMutableServerState(
    USER_MUTATIONS.deleteCredential(id)
  );
  const toast = useToast();
  const queryClient = useQueryClient();

  const verifyLeaf = () => {
    if (chainContext.address) {
      console.log("verifying leaf...");
      const { leaf, proof } = generateProof(credential, tree);
      console.log(leaf, proof);
      coredinClient
        ?.verifyCredential({
          did: subjectDid,
          credentialHash: leaf,
          merkleProofs: proof
        })
        .then((result: boolean) => {
          console.log(result);
          if (result) {
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
                  Credential successfully verified onchain.
                </Box>
              ),
              isClosable: true
            });
          }
        });
    }
  };

  const handleDelete = () => {
    mutateAsync({ permanent: true }).then(() => {
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
            Credential deleted successfully
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
    <HStack
      align="start"
      borderBottom="2px solid #3E3D3A"
      _last={{ borderBottom: "none" }}
      py="1.5em"
    >
      <VStack
        align="start"
        spacing="1em"
        color={verified ? "text.100" : "text.800"}
      >
        {verified && issuer && (
          <>
            <Badge cursor="pointer" onClick={verifyLeaf} variant="verified">
              Verified
            </Badge>
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
          </HStack>

          <Text fontSize={{ base: "0.875rem", lg: "1rem" }}>
            {establishment}
          </Text>
          <Text fontSize={{ base: "0.875rem", lg: "1rem" }}>
            {startDate} — {endDate || "Present"}
          </Text>
        </VStack>

        {verified && issuer && (
          <Text fontSize={{ base: "0.875rem", lg: "1rem" }} lineHeight="1.5">
            {`Verified by `}
            <Link
              to={ROUTES.USER.buildPath(credential.issuerWallet)}
              as={ReactRouterLink}
              _hover={{ color: "brand.500" }}
              wordBreak="break-word"
            >
              {issuer}
            </Link>
          </Text>
        )}
      </VStack>
      {showOptions && (
        <Menu offset={[-105, -10]}>
          <MenuButton
            as={IconButton}
            variant="empty"
            color="text.400"
            aria-label="See menu."
            icon={<FaEllipsis fontSize="1.5rem" />}
            size="lg"
            isLoading={isDeleting}
            mt="-0.675em"
          />
          <MenuList>
            <MenuItem
              onClick={handleDelete}
              // border="1px solid red"
              icon={<FaTrash color="red" />}
            >
              <Text as="span" color="red">
                Delete
              </Text>
            </MenuItem>
          </MenuList>
        </Menu>
      )}
    </HStack>
  );
};

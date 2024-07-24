import { BaseServerStateKeys } from "@/constants";
import { CoredinClientContext } from "@/contexts/CoredinClientContext";
import { useMutableServerState } from "@/hooks";
import { USER_MUTATIONS } from "@/queries";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Badge,
  Box,
  Button,
  HStack,
  IconButton,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useDisclosure,
  useToast,
  VStack
} from "@chakra-ui/react";
import { CredentialDTO, TESTNET_CHAIN_NAME } from "@coredin/shared";
import { useChain } from "@cosmos-kit/react";
import { useQueryClient } from "@tanstack/react-query";
import MerkleTree from "merkletreejs";
import { FC, useContext, useRef } from "react";
import { FaEllipsis, FaTrash } from "react-icons/fa6";
import { Link as ReactRouterLink } from "react-router-dom";
import { generateProof } from "../helpers/generateProof";
import { ROUTES } from "@/router/routes";
import { CredentialContent } from "./credentials";

type CredentialProps = {
  profileWallet: string;
  credential: CredentialDTO;
  tree: MerkleTree;
  showOptions: boolean;
};

export const Credential: FC<CredentialProps> = ({
  profileWallet,
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
    issuer,
    issuerWallet,
    issuerUsername
  } = credential;
  const chainContext = useChain(TESTNET_CHAIN_NAME);
  const coredinClient = useContext(CoredinClientContext);
  const { mutateAsync, isPending: isDeleting } = useMutableServerState(
    USER_MUTATIONS.deleteCredential(id)
  );
  const toast = useToast();
  const queryClient = useQueryClient();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef(null);

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
                  Credential successfully verified onchain
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
    onClose();
  };

  return (
    <HStack
      as="article"
      align="start"
      borderBottom="2px solid #3E3D3A"
      _last={{ borderBottom: "none" }}
      py="1.5em"
      // border="1px solid red"
    >
      <VStack
        align="start"
        spacing="1em"
        color={verified ? "text.100" : "text.800"}
        w="100%"
      >
        {verified && issuer && issuerWallet !== profileWallet && (
          <Badge cursor="pointer" onClick={verifyLeaf} variant="verified">
            Verified
          </Badge>
        )}
        <CredentialContent
          title={title}
          establishment={establishment}
          startDate={startDate}
          endDate={endDate}
        />

        {verified &&
          issuer &&
          (issuerWallet === profileWallet ? (
            <Text fontSize={{ base: "0.875rem", lg: "1rem" }} lineHeight="1.5">
              The credential is self-issued
            </Text>
          ) : (
            <Text fontSize={{ base: "0.875rem", lg: "1rem" }} lineHeight="1.5">
              {`Verified by `}
              <Link
                to={ROUTES.USER.buildPath(credential.issuerWallet)}
                as={ReactRouterLink}
                _hover={{ color: "brand.500" }}
                wordBreak="break-word"
              >
                @{issuerUsername}
              </Link>
            </Text>
          ))}
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
              onClick={onOpen}
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
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        motionPreset="slideInBottom"
        isCentered
        closeOnEsc
        closeOnOverlayClick
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Credential
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? You can't undo this action afterwards.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button
                ref={cancelRef}
                onClick={onClose}
                bg="transparent"
                color="inherit"
                _hover={{ bg: "background.400" }}
              >
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </HStack>
  );
};

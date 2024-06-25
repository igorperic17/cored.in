import { Button, Center, VStack } from "@chakra-ui/react";
import { TabsContainer, UserHeader } from "../components";
import { useParams } from "react-router-dom";
import { useLoggedInServerState } from "@/hooks";
import { FEED_QUERIES } from "@/queries/FeedQueries";
import { USER_QUERIES } from "@/queries";
import { getSections } from "../helpers/getSections";
import { GetMerkleRootResponse, TESTNET_CHAIN_NAME } from "@coredin/shared";
import { useChain } from "@cosmos-kit/react";
import { CoredinClientContext } from "@/contexts/CoredinClientContext";
import { useContext, useEffect, useState } from "react";
import { generateTree } from "../helpers/generateTree";
import MerkleTree from "merkletreejs";

const UserPage = () => {
  const chainContext = useChain(TESTNET_CHAIN_NAME);
  const coredinClient = useContext(CoredinClientContext);

  const { wallet } = useParams();
  const { data: userProfile } = useLoggedInServerState(
    USER_QUERIES.getUser(wallet || ""),
    {
      enabled: !!wallet
    }
  );
  const { data: posts } = useLoggedInServerState(
    FEED_QUERIES.getUserFeed(wallet || ""),
    { enabled: !!wallet }
  );

  const [isUpdateRootDisabled, setIsUpdateRootDisabled] = useState(true);
  const [tree, setTree] = useState<MerkleTree | null>(null);

  const updateTree = () => {
    if (userProfile) {
      setTree(generateTree(userProfile.credentials || []));
    } else {
      setTree(null);
    }
  };

  const updateIsUpdateRootDisabled = () => {
    if (userProfile?.did && tree && userProfile.credentials.length > 0) {
      const root = tree.getHexRoot().substring(2);
      console.log("getting onchain root.. profile root:", root);
      coredinClient
        ?.getMerkleRoot({ did: userProfile.did })
        .then((registered_root: GetMerkleRootResponse) => {
          if (registered_root.root !== root) {
            setIsUpdateRootDisabled(false);
          }
        })
        .catch((error) => {
          console.error(error);

          if (error.message.includes("Merkle root not found:")) {
            setIsUpdateRootDisabled(false);
          }
        });
    } else {
      setIsUpdateRootDisabled(true);
    }
  };

  useEffect(updateIsUpdateRootDisabled, [
    chainContext.address,
    chainContext.isWalletConnected,
    userProfile,
    tree,
    coredinClient
  ]);

  useEffect(updateTree, [userProfile]);

  const updateMerkleRoot = () => {
    console.log("updating merkle root...", coredinClient);
    if (userProfile?.did && tree) {
      const root = tree.getHexRoot().substring(2);

      console.log("Registering root onchain...", root);
      coredinClient
        ?.updateCredentialMerkleRoot({
          did: userProfile.did,
          root
        })
        .then((result) => {
          console.log(result);
          setIsUpdateRootDisabled(true);
        })
        .catch((error) => {
          console.log("error while registering");
          console.error(error);
        });
    }
  };

  // const theme = useTheme();
  // const [isLargerThanLg] = useMediaQuery(
  //   `(min-width: ${theme.breakpoints.lg})`
  // );
  if (!wallet) {
    return "This user does not exist.";
  }

  const isOwnProfile = chainContext.address === wallet;

  return (
    <VStack spacing={{ base: "0.5em", lg: "1.5em" }} mb="4em">
      {userProfile && (
        <UserHeader userProfile={userProfile} showEdit={isOwnProfile} />
      )}
      {wallet === chainContext.address && !isUpdateRootDisabled && (
        <Center>
          <Button
            variant="primary"
            onClick={updateMerkleRoot}
            isDisabled={isUpdateRootDisabled}
          >
            Update credentials ZK proof
          </Button>
        </Center>
      )}

      <TabsContainer
        posts={posts || []}
        sections={
          tree
            ? getSections(userProfile?.credentials || [], tree, isOwnProfile)
            : []
        }
        showRequestButton={isOwnProfile}
      />
      {/* {!isLargerThanLg && <SubscribeToProfile />} */}
      {/* <NewPost /> */}
      {/* <Feed posts={posts || []} /> */}
    </VStack>
  );
};

export default UserPage;

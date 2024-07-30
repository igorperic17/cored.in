import { CoredinClientContext } from "@/contexts/CoredinClientContext";
import { Button, Text, useDisclosure, VStack } from "@chakra-ui/react";
import { useChain } from "@cosmos-kit/react";
import { FC, useContext, useEffect, useState } from "react";
import { DidInfo, TESTNET_CHAIN_NAME } from "@coredin/shared";
import { SubscriptionModal } from ".";

type SubscribeToProfileProps = {
  profileDid: DidInfo;
};

export const SubscribeToProfile: FC<SubscribeToProfileProps> = ({
  profileDid
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const chainContext = useChain(TESTNET_CHAIN_NAME);
  const coredinClient = useContext(CoredinClientContext);
  const [price, setPrice] = useState<number>();

  // const updateOnchainPrice = () => {
  //   if (chainContext.address) {
  //     console.log("getting onchain price");
  //     coredinClient
  //       ?.getSubscriptionPrice({ did: profileDid.did })
  //       .then((registered_did: GetDIDResponse) => {
  //         console.log(registered_did);
  //         if (registered_did.did_info) {
  //           setOnchainProfile(registered_did.did_info);
  //         }
  //         setIsLoadingContract(false);
  //       })
  //       .catch((error) => {
  //         console.error(error);
  //         setIsLoadingContract(false);
  //       });
  //   } else {
  //     setOnchainProfile(null);
  //   }
  // };

  // useEffect(updateOnchainPrice, [
  //   chainContext.address,
  //   chainContext.isWalletConnected,
  //   coredinClient
  // ]);

  return (
    <VStack
      layerStyle="cardBox"
      w="100%"
      p="1.125em"
      pb="1.75em"
      spacing="3em"
      boxShadow="0 0 15px 0px #7AF9B3"
      my={{ base: "1em", lg: "0" }}
    >
      <Text
        textStyle="lg"
        // fontSize="1.5em"
        color="text.100"
        // textTransform="uppercase"
        textAlign="center"
      >
        Subscribe to this user's profile to see their posts and credentials.
      </Text>
      <Button
        variant="primary"
        size="sm"
        w="100%"
        alignSelf="end"
        onClick={onOpen}
      >
        Subscribe for 4.45 CORE
      </Button>
      {/* <SubscriptionModal isOpen={isOpen} onClose={onClose} /> */}
    </VStack>
  );
};

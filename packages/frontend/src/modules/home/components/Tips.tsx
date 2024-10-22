import {
  Box,
  Button,
  Flex,
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useDisclosure
} from "@chakra-ui/react";
import { TipsNotificationCard, TransferModal } from ".";
import { useLoggedInServerState, useMutableServerState } from "@/hooks";
import { USER_MUTATIONS, USER_QUERIES } from "@/queries";
import { useEffect, useState } from "react";
import { useChain } from "@cosmos-kit/react";
import { TESTNET_CHAIN_NAME, TESTNET_FEE_DENOM } from "@coredin/shared";

export const Tips = () => {
  const chainContext = useChain(TESTNET_CHAIN_NAME);
  const [balance, setBalance] = useState(0);
  const { data: tips } = useLoggedInServerState(USER_QUERIES.getTips());
  const { mutateAsync: updateTipsSeen } = useMutableServerState(
    USER_MUTATIONS.updateTipsSeen()
  );

  const getBalance = async () => {
    if (!chainContext.address) {
      setBalance(0);
      return;
    }

    const client = await chainContext.getCosmWasmClient();
    const coin = await client.getBalance(
      chainContext.address,
      TESTNET_FEE_DENOM
    );

    // TODO - REVIEW DECIMALS AFTER TESTNET, utestcore has 6 decimals!
    setBalance(Number((BigInt(coin.amount) * 1000000n) / 1000000n) / 1000000);
  };

  useEffect(() => {
    const interval = setInterval(getBalance, 5000);

    return () => clearInterval(interval);
  }, [chainContext.address]);

  const unseenTips =
    tips?.receivedTips.filter((tip) => !tip.isViewed).map((tip) => tip.id) ||
    [];

  useEffect(() => {
    if (unseenTips.length > 0) {
      updateTipsSeen({ tipIds: unseenTips });
    }
  }, [JSON.stringify(unseenTips)]);

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Flex
        direction="column"
        layerStyle="cardBox"
        gap="2em"
        mb={{ base: "0.5em", lg: "1.5em" }}
      >
        <Heading as="h1">Tips</Heading>
        <Flex justify="space-between" gap="1em" align="center">
          <Flex direction="column-reverse" gap="0em">
            <Heading
              as="h2"
              color="other.200"
              fontSize="1rem"
              textTransform="uppercase"
            >
              Wallet balance
            </Heading>
            <Text as="span" fontSize="2rem" fontWeight="700">
              {`${balance > 0 ? balance : "..."} CORE`}
            </Text>
          </Flex>
          <Button variant="primary" size="md" onClick={onOpen}>
            Transfer
          </Button>
          <TransferModal isOpen={isOpen} onClose={onClose} balance={balance} />
        </Flex>
      </Flex>

      <Tabs isFitted size="md" variant="unstyled">
        <TabList>
          <Tab>Received</Tab>
          <Tab>Sent</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Flex as="ul" w="100%" direction="column" gap="0.5em">
              {tips?.receivedTips.map((tip) => (
                <li key={tip.id}>
                  <TipsNotificationCard tip={tip} direction="received" />
                </li>
              ))}
            </Flex>
            {tips && tips.receivedTips.length === 0 && (
              <Box p="1em">
                <Text textStyle="sm">No tips have been received yet.</Text>
              </Box>
            )}
          </TabPanel>
          <TabPanel>
            <Flex as="ul" w="100%" direction="column" gap="0.5em">
              {tips?.sentTips.map((tip) => (
                <li key={tip.id}>
                  <TipsNotificationCard tip={tip} direction="sent" />
                </li>
              ))}
            </Flex>
            {tips && tips.sentTips.length === 0 && (
              <Box p="1em">
                <Text textStyle="sm">No tips have been sent yet.</Text>
              </Box>
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
};

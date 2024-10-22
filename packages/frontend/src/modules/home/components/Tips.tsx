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

export const Tips = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Flex
        direction="column"
        layerStyle="cardBox"
        gap="2em"
        mb={{ base: "0.5em", lg: "1.5em" }}
      >
        <Heading as="h1">Earnings</Heading>
        <Flex justify="space-between" gap="1em" align="center">
          <Flex direction="column-reverse" gap="0em">
            <Heading
              as="h2"
              color="other.200"
              fontSize="1rem"
              textTransform="uppercase"
            >
              My balance
            </Heading>
            <Text as="span" fontSize="2rem" fontWeight="700">
              {`${2870} CORE`}
            </Text>
          </Flex>
          <Button variant="primary" size="md" onClick={onOpen}>
            Transfer
          </Button>
          <TransferModal isOpen={isOpen} onClose={onClose} balance={2870} />
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
              <li>
                <TipsNotificationCard />
              </li>
            </Flex>

            {/* TODO: Use this when there are no tips */}
            <Box p="1em">
              <Text textStyle="sm">No one has tipped you yet.</Text>
            </Box>
          </TabPanel>
          <TabPanel>
            <Flex as="ul" w="100%" direction="column" gap="0.5em">
              <li>
                <TipsNotificationCard />
              </li>
            </Flex>

            {/* TODO: Use this when there are no tips */}
            <Box p="1em">
              <Text textStyle="sm">You haven't tipped anyone yet.</Text>
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
};

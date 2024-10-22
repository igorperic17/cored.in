import { Button, Flex, Heading, Text, useDisclosure } from "@chakra-ui/react";
import { TipsNotificationCard, TransferModal } from ".";

export const Tips = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Flex direction="column" layerStyle="cardBox" gap="2em">
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

      <Flex as="ul" w="100%" direction="column" gap="0.5em">
        <li>
          <TipsNotificationCard />
        </li>
        <li>
          <TipsNotificationCard />
        </li>
        <li>
          <TipsNotificationCard />
        </li>
      </Flex>
    </Flex>
  );
};

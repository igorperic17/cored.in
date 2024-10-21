import {
  Box,
  Button,
  Center,
  Flex,
  Grid,
  GridItem,
  Heading,
  Text
} from "@chakra-ui/react";
import { TipsNotificationCard } from ".";

export const Tips = () => {
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
            {`${70} CORE`}
          </Text>
        </Flex>
        {/* TODO: Add modal where we handle the withdrawal */}
        <Button variant="primary" size="md">
          Withdraw
        </Button>
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

import { Box, Flex, Grid, Icon, Link } from "@chakra-ui/react";
import { navigationData } from "../constants/navigationData";
import { Link as ReactRouterLink } from "react-router-dom";
import { FaTriangleExclamation } from "react-icons/fa6";

export const NavigationMobile = () => {
  return (
    <Box as="nav" position="fixed" bottom="0" w="100%" bg="background.800">
      <Grid as="ul" templateColumns="repeat(5, 1fr)">
        {navigationData.map((item, index) => (
          <Flex
            as="li"
            key={`home-navigation-mobile-${index}`}
            borderTop="1px solid"
            borderTopColor="background.600"
            listStyleType="none"
            w="100%"
            p="1em"
            justify="center"
            align="center"
          >
            <Link
              as={ReactRouterLink}
              to={item.link}
              fontSize="1.375rem"
              color="inherit"
              _hover={{
                div: {
                  background: "background.600"
                }
                // textDecoration: "none"
              }}
              _focus={{
                div: {
                  background: "background.600"
                }
                // outline: "none",
                // textDecoration: "none"
              }}
            >
              <Icon as={item.icon} />
            </Link>
          </Flex>
        ))}
        <Flex
          as="li"
          key={`home-navigation-mobile-4`}
          borderTop="1px solid"
          borderTopColor="background.600"
          listStyleType="none"
          w="100%"
          p="1em"
          justify="center"
          align="center"
        >
          <Icon as={FaTriangleExclamation} fontSize="1.375rem" />
        </Flex>
      </Grid>
    </Box>
  );
};

import {
  Box,
  Center,
  Heading,
  Spinner,
  VStack,
  VisuallyHidden
} from "@chakra-ui/react";
import { Feed } from "../components/Feed";
import { CreatePost } from "../components";
import { FEED_QUERIES } from "@/queries/FeedQueries";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect } from "react";

const SCROLL_FETCH_DELAY_MS = 200;

const HomePage = () => {
  const {
    data: posts,
    fetchNextPage,
    isFetchingNextPage
  } = useInfiniteQuery({
    ...FEED_QUERIES.getFeed(),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      if (lastPage.length === 0) {
        return undefined;
      }
      return lastPageParam + 1;
    },
    getPreviousPageParam: (firstPage, allPages, firstPageParam) => {
      if (firstPageParam <= 1) {
        return undefined;
      }
      return firstPageParam - 1;
    }
  });

  let timeoutId: string | number | NodeJS.Timeout | undefined;

  const checkInView = () => {
    clearTimeout(timeoutId);
    const element = document.querySelector(`#home-feed`);
    if (element) {
      const rect = element.getBoundingClientRect();
      if (rect.bottom < window.innerHeight && !isFetchingNextPage) {
        return new Promise(
          () =>
            (timeoutId = setTimeout(async () => {
              fetchNextPage();
            }, SCROLL_FETCH_DELAY_MS))
        );
      }
    }
  };

  useEffect(() => {
    document.addEventListener("scroll", checkInView);
    return () => {
      document.removeEventListener("scroll", checkInView);
    };
  }, []);

  return (
    <VStack spacing={{ base: "0.5em", lg: "1.5em" }} onScroll={checkInView}>
      <VisuallyHidden>
        <Heading as="h1">Home page, user feed</Heading>
      </VisuallyHidden>
      <CreatePost />
      <Box id="home-feed" layerStyle="cardBox" py="1em" w="100%">
        <Feed posts={posts?.pages.flatMap((page) => page) || []} />
        {isFetchingNextPage && (
          <Center mt="32px">
            <Spinner size="xl" color="brand.500" />
          </Center>
        )}
      </Box>
    </VStack>
  );
};

export default HomePage;

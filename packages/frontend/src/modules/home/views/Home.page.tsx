import {
  Center,
  Flex,
  Heading,
  Spinner,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  VisuallyHidden
} from "@chakra-ui/react";
import { Feed } from "../components/Feed";
import { CreatePost } from "../components";
import { FEED_QUERIES } from "@/queries/FeedQueries";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { PostRequestType } from "@coredin/shared";
import { END_FEED_PHRASES } from "../components/post/constants";

const SCROLL_FETCH_DELAY_MS = 200;

const HomePage = () => {
  const {
    data: posts,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage
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

  const completeFeed = posts?.pages.flatMap((page) => page) || [];

  const postsOnly =
    posts?.pages.flatMap((page) => page).filter((post) => !post.requestType) ||
    [];

  const jobsAndGigsOnly =
    posts?.pages
      .flatMap((page) => page)
      .filter(
        (post) =>
          post.requestType === PostRequestType.JOB ||
          post.requestType === PostRequestType.GIG
      ) || [];

  const randomEndFeedPhrase =
    END_FEED_PHRASES[Math.floor(Math.random() * END_FEED_PHRASES.length)];

  return (
    <Flex
      direction="column"
      gap={{ base: "0.5em", lg: "1.5em" }}
      onScroll={checkInView}
    >
      <VisuallyHidden>
        <Heading as="h1">Home page, user feed</Heading>
      </VisuallyHidden>
      <CreatePost />
      <Tabs variant="softRounded" size="sm">
        <TabList>
          <Tab>All</Tab>
          <Tab>Posts</Tab>
          <Tab>Offers</Tab>
        </TabList>
        <TabPanels id="home-feed">
          <TabPanel>
            <Feed posts={completeFeed} />
          </TabPanel>
          <TabPanel>
            <Feed posts={postsOnly} />
          </TabPanel>
          <TabPanel>
            <Feed posts={jobsAndGigsOnly} />
          </TabPanel>
          {isFetchingNextPage && (
            <Center mt="32px">
              <Spinner size="xl" color="brand.500" />
            </Center>
          )}
          {posts?.pages[0] && !hasNextPage && (
            <Text
              textStyle="sm"
              color="text.700"
              w="80%"
              mx="auto"
              textAlign="center"
            >
              {randomEndFeedPhrase}
            </Text>
          )}
        </TabPanels>
      </Tabs>
    </Flex>
  );
};

export default HomePage;

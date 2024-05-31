import { feedService } from "@/dependencies";
import { BaseServerStateKeys } from "../constants";

export const FEED_QUERIES = {
  get: (postId: number) => ({
    queryKey: [BaseServerStateKeys.POST, postId.toString()],
    queryFn: () => feedService.get(postId)
  }),
  getFeed: (needsAuth: boolean) => ({
    queryKey: [BaseServerStateKeys.FEED, needsAuth.toString()],
    queryFn: () => feedService.getFeed()
  }),
  getUserFeed: (user: string, needsAuth: boolean) => ({
    queryKey: [BaseServerStateKeys.USER_FEED, user, needsAuth.toString()],
    queryFn: () => feedService.getUserFeed(user)
  })
};

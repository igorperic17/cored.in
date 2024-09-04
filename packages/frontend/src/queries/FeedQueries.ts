import { feedService } from "@/dependencies";
import { BaseServerStateKeys } from "../constants";

export const FEED_QUERIES = {
  get: (postId: number, creator: string) => ({
    queryKey: [BaseServerStateKeys.POST, postId.toString(), creator],
    queryFn: () => feedService.get(postId, creator)
  }),
  getFeed: (needsAuth: boolean) => ({
    queryKey: [BaseServerStateKeys.FEED, needsAuth.toString()],
    queryFn: () => feedService.getFeed()
  }),
  getUserFeed: (user: string) => ({
    queryKey: [BaseServerStateKeys.USER_FEED, user],
    queryFn: () => feedService.getUserFeed(user)
  }),
  getMessages: () => ({
    queryKey: [BaseServerStateKeys.MESSAGES_FEED],
    queryFn: () => feedService.getMessageFeed()
  })
};

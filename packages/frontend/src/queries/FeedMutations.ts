import { feedService } from "@/dependencies";
import { CreatePostDTO } from "@coredin/shared";
import { BaseServerStateKeys } from "../constants";

export const FEED_MUTATIONS = {
  publish: () => ({
    mutationKey: [BaseServerStateKeys.PUBLISH],
    mutationFn: ({ post }: { post: CreatePostDTO }) => feedService.publish(post)
  }),
  likePost: () => ({
    mutationKey: [BaseServerStateKeys.LIKE_POST],
    mutationFn: ({ postId, liked }: { postId: number; liked: boolean }) =>
      feedService.likePost(postId, liked)
  }),
  deletePost: () => ({
    mutationKey: [BaseServerStateKeys.DELETE_POST],
    mutationFn: ({ postId }: { postId: number }) =>
      feedService.deletePost(postId)
  })
};

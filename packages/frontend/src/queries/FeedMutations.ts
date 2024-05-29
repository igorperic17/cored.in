import { feedService } from "@/dependencies";
import { CreatePostDTO } from "@coredin/shared";
import { BaseServerStateKeys } from "../constants";

export const FEED_MUTATIONS = {
  publish: () => ({
    mutationKey: [BaseServerStateKeys.PUBLISH],
    mutationFn: ({ post }: { post: CreatePostDTO }) => feedService.publish(post)
  })
};

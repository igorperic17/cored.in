import { PostVisibility } from "./PostVisibility";

export type CreatePostDTO = {
  text: string;
  visibility: PostVisibility;
  replyToPostId?: number;
};

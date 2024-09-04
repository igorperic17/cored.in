import { PostVisibility } from "./PostVisibility";

export type CreatePostDTO = {
  text: string;
  visibility: PostVisibility;
  recipients?: string[];
  replyToPostId?: number;
};

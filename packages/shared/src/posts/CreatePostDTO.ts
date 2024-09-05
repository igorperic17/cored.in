import { PostVisibility } from "./PostVisibility";

export type CreatePostDTO = {
  text: string;
  visibility: PostVisibility;
  recipientWallets?: string[];
  replyToPostId?: number;
};

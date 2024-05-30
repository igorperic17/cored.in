import { PostVisibility } from "./PostVisibility";

export type PostDTO = {
  id: number;
  creatorWallet: string;
  creatorAvatar: string;
  visibility: PostVisibility;
  text: string;
  createdAt: Date;
  likes: number;
  replyToPostId?: number;
};

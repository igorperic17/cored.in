import { PostDTO } from "./PostDTO";

export type PostDetailDTO = PostDTO & {
  replies: PostDTO[];
};

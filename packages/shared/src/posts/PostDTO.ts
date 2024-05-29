export type PostDTO = {
  text: string;
  createdAt: Date;
  likes: number;
  replyToPostId?: number;
};

import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ArrayContains, Repository } from "typeorm";
import { Post } from "./post.entity";
import { CreatePostDTO, PostDTO, PostVisibility } from "@coredin/shared";
import { User } from "@/user/user.entity";

@Injectable()
export class PostsService {
  private readonly logger = new Logger("PostsService");

  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>
  ) {}

  async getPublic(): Promise<PostDTO[]> {
    return (
      await this.postRepository.find({
        relations: ["user"],
        where: { visibility: PostVisibility.PUBLIC },
        order: { createdAt: "DESC" }
      })
    ).map((post) => this.fromDb(post));
  }

  async getPublicUserPosts(creatorWallet: string): Promise<PostDTO[]> {
    return (
      await this.postRepository.find({
        relations: ["user"],
        where: { visibility: PostVisibility.PUBLIC, creatorWallet },
        order: { createdAt: "DESC" }
      })
    ).map((post) => this.fromDb(post));
  }

  async getAllUserPosts(creatorWallet: string): Promise<PostDTO[]> {
    return (
      await this.postRepository.find({
        relations: ["user"],
        where: { creatorWallet },
        order: { createdAt: "DESC" }
      })
    ).map((post) => this.fromDb(post));
  }

  async create(wallet: string, data: CreatePostDTO) {
    // Attention: using insert won't trigger cascades, relations, etc..
    return await this.postRepository.insert({
      creatorWallet: wallet,
      createdAt: new Date(),
      ...data
    });
  }

  async updateLikedPost(wallet: string, postId: number, liked: boolean) {
    return await this.postRepository.manager.transaction(
      "SERIALIZABLE",
      async (transactionalEntityManager) => {
        const alreadyLiked = await transactionalEntityManager.findOne(User, {
          where: {
            wallet,
            likedPosts: ArrayContains([postId])
          }
        });
        if ((alreadyLiked && liked) || (!alreadyLiked && !liked)) {
          return;
        }
        await transactionalEntityManager.update(
          User,
          { wallet },
          {
            likedPosts: liked
              ? () => `array_append("likedPosts", ${postId})`
              : () => `array_remove("likedPosts", ${postId})`
          }
        );
        await transactionalEntityManager.update(
          Post,
          { id: postId },
          {
            likes: liked ? () => "likes + 1" : () => "likes - 1"
          }
        );
      }
    );
  }

  private fromDb(post: Post): PostDTO {
    return {
      id: post.id,
      creatorWallet: post.creatorWallet,
      creatorAvatar: post.user.avatar,
      visibility: post.visibility,
      text: post.text,
      createdAt: post.createdAt,
      likes: post.likes,
      replyToPostId: post.replyToPostId
    };
  }
}

import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ArrayContains, IsNull, Repository } from "typeorm";
import { Post } from "./post.entity";
import {
  CreatePostDTO,
  PostDTO,
  PostDetailDTO,
  PostVisibility
} from "@coredin/shared";
import { User } from "@/user/user.entity";

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>
  ) {}

  async get(id: number): Promise<PostDetailDTO> {
    const postWithReplies = await this.postRepository.findOne({
      relations: ["user", "parent", "parent.user", "replies", "replies.user"],
      where: { id, visibility: PostVisibility.PUBLIC },
      order: { createdAt: "DESC" }
    });
    if (!postWithReplies) {
      throw new NotFoundException("Post not found");
    }

    return {
      ...this.fromDb(postWithReplies),
      parent: postWithReplies.parent
        ? this.fromDb(postWithReplies.parent)
        : undefined,
      replies: postWithReplies.replies.map(this.fromDb)
    };
  }

  async getPublic(): Promise<PostDTO[]> {
    return (
      await this.postRepository.find({
        relations: ["user"],
        where: { visibility: PostVisibility.PUBLIC, replyToPostId: IsNull() },
        order: { createdAt: "DESC" }
      })
    ).map((post) => this.fromDb(post));
  }

  async getPublicUserPosts(creatorWallet: string): Promise<PostDTO[]> {
    return (
      await this.postRepository.find({
        relations: ["user"],
        where: {
          visibility: PostVisibility.PUBLIC,
          creatorWallet,
          replyToPostId: IsNull()
        },
        order: { createdAt: "DESC" }
      })
    ).map((post) => this.fromDb(post));
  }

  async getAllUserPosts(creatorWallet: string): Promise<PostDTO[]> {
    return (
      await this.postRepository.find({
        relations: ["user"],
        where: { creatorWallet, replyToPostId: IsNull() },
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

  async delete(wallet: string, postId: number) {
    return await this.postRepository.delete({
      creatorWallet: wallet,
      id: postId
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
      creatorUsername: post.user.username,
      creatorAvatar: post.user.avatarUrl,
      visibility: post.visibility,
      text: post.text,
      createdAt: post.createdAt.toISOString(),
      likes: post.likes,
      replyToPostId: post.replyToPostId
    };
  }
}

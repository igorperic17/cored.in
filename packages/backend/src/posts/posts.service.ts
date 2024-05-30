import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Post } from "./post.entity";
import { CreatePostDTO, PostDTO, PostVisibility } from "@coredin/shared";

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

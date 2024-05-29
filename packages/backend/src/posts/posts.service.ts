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
      await this.postRepository
        .createQueryBuilder("posts")
        .where("posts.visibility = :visibility", {
          visibility: PostVisibility.PUBLIC
        })
        .orderBy("posts.createdAt", "DESC")
        .getMany()
    ).map((post) => this.fromDb(post));
  }

  async getPublicUserPosts(wallet: string): Promise<PostDTO[]> {
    return (
      await this.postRepository
        .createQueryBuilder("posts")
        .where("posts.visibility = :visibility", {
          visibility: PostVisibility.PUBLIC
        })
        .orderBy("posts.createdAt", "DESC")
        .leftJoinAndSelect("posts.user", "user")
        .where("user.wallet = :wallet", { wallet })
        .getMany()
    ).map((post) => this.fromDb(post));
  }

  async getAllUserPosts(wallet: string): Promise<PostDTO[]> {
    return (
      await this.postRepository
        .createQueryBuilder("posts")
        .orderBy("posts.createdAt", "DESC")
        .leftJoinAndSelect("posts.user", "user")
        .where("user.wallet = :wallet", { wallet })
        .getMany()
    ).map((post) => this.fromDb(post));
  }

  async create(wallet: string, data: CreatePostDTO) {
    // Attention: using insert won't trigger cascades, relations, etc..
    return await this.postRepository.insert({
      user: { wallet },
      ...data
    });
  }

  private fromDb(post: Post): PostDTO {
    return {
      text: post.text,
      createdAt: post.createdAt,
      likes: post.likes,
      replyToPostId: post.replyToPostId
    };
  }
}

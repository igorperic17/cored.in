import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Post } from "./post.entity";
import { CreatePostDTO, PostVisibility } from "@coredin/shared";

@Injectable()
export class PostsService {
  private readonly logger = new Logger("PostsService");

  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>
  ) {}

  async getPublic(): Promise<Post[]> {
    return this.postRepository
      .createQueryBuilder("posts")
      .where("posts.visibility = :visibility", {
        visibility: PostVisibility.PUBLIC
      })
      .orderBy("posts.createdAt", "DESC")
      .getMany();
  }

  async getPublicUserPosts(wallet: string): Promise<Post[]> {
    return this.postRepository
      .createQueryBuilder("posts")
      .where("posts.visibility = :visibility", {
        visibility: PostVisibility.PUBLIC
      })
      .orderBy("posts.createdAt", "DESC")
      .leftJoinAndSelect("posts.user", "user")
      .where("user.wallet = :wallet", { wallet })
      .getMany();
  }

  async getAllUserPosts(wallet: string): Promise<Post[]> {
    return this.postRepository
      .createQueryBuilder("posts")
      .orderBy("posts.createdAt", "DESC")
      .leftJoinAndSelect("posts.user", "user")
      .where("user.wallet = :wallet", { wallet })
      .getMany();
  }

  async create(wallet: string, data: CreatePostDTO) {
    // Attention: using insert won't trigger cascades, relations, etc..
    return await this.postRepository.insert({
      user: { wallet },
      ...data
    });
  }
}

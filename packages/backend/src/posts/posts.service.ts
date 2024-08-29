import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Any, ArrayContains, IsNull, Repository } from "typeorm";
import { Post } from "./post.entity";
import {
  CreatePostDTO,
  PostDTO,
  PostDetailDTO,
  PostVisibility
} from "@coredin/shared";
import { User } from "@/user/user.entity";
import { CoredinContractService } from "@/coreum/services";

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @Inject(CoredinContractService)
    private readonly coredinContractService: CoredinContractService
  ) {}

  async get(
    id: number,
    creator: string,
    requester: string
  ): Promise<PostDetailDTO> {
    let postWithReplies = await this.getWithRelations(
      id,
      PostVisibility.PUBLIC,
      creator
    );

    // If public not found, look for private post if requester is subscriber
    if (!postWithReplies) {
      const isSubscribed = await this.coredinContractService.isWalletSubscribed(
        creator,
        requester
      );
      if (isSubscribed) {
        postWithReplies = await this.getWithRelations(
          id,
          PostVisibility.PRIVATE,
          creator
        );
      }
    }

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

  async getPublicFeed(): Promise<PostDTO[]> {
    return (
      await this.postRepository.find({
        relations: ["user"],
        where: { visibility: PostVisibility.PUBLIC, replyToPostId: IsNull() },
        order: { createdAt: "DESC" }
      })
    ).map((post) => this.fromDb(post));
  }

  async getPublicAndSubscribedFeed(
    requesterWallet: string
  ): Promise<PostDTO[]> {
    const allSubscriptions =
      await this.coredinContractService.getAllSubscriptions(requesterWallet);
    const subscribedWallets = allSubscriptions.map(
      (subscription) => subscription.subscribed_to_wallet
    );
    return (
      await this.postRepository.find({
        relations: ["user"],
        where: [
          { visibility: PostVisibility.PUBLIC, replyToPostId: IsNull() },
          {
            creatorWallet: Any([...subscribedWallets, requesterWallet]),
            visibility: PostVisibility.PRIVATE,
            replyToPostId: IsNull()
          }
        ],
        order: { createdAt: "DESC" }
      })
    ).map((post) => this.fromDb(post));
  }

  async getUserPosts(
    creatorWallet: string,
    requesterWallet: string
  ): Promise<PostDTO[]> {
    if (creatorWallet === requesterWallet) {
      return await this.getAllUserPosts(creatorWallet);
    }
    const isSubscribed = await this.coredinContractService.isWalletSubscribed(
      creatorWallet,
      requesterWallet
    );
    if (isSubscribed) {
      return await this.getAllUserPosts(creatorWallet);
    }

    return await this.getPublicUserPosts(creatorWallet);
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

  private async getAllUserPosts(creatorWallet: string): Promise<PostDTO[]> {
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

  private async getWithRelations(
    id: number,
    visibility: PostVisibility,
    creatorWallet: string
  ) {
    return await this.postRepository.findOne({
      relations: ["user", "parent", "parent.user", "replies", "replies.user"],
      where: { id, visibility, creatorWallet },
      order: { createdAt: "DESC" }
    });
  }

  private fromDb(post: Post): PostDTO {
    return {
      id: post.id,
      creatorWallet: post.creatorWallet,
      creatorUsername: post.user.username,
      creatorAvatar: post.user.avatarUrl,
      creatorAvatarFallbackColor: post.user.avatarFallbackColor,
      visibility: post.visibility,
      text: post.text,
      createdAt: post.createdAt.toISOString(),
      likes: post.likes,
      replyToPostId: post.replyToPostId
    };
  }
}

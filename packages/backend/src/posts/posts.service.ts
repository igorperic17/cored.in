import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  Any,
  ArrayContains,
  FindOptionsWhere,
  IsNull,
  Repository
} from "typeorm";
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
    creatorWallet: string,
    requester: string
  ): Promise<PostDetailDTO> {
    let postWithReplies = await this.getWithRelations([
      { id, visibility: PostVisibility.PUBLIC, creatorWallet }
    ]);

    // If public not found, look for recipient posts or private post if requester is subscriber
    if (!postWithReplies) {
      const conditions = [
        { id, visibility: PostVisibility.RECIPIENTS, creatorWallet: requester }, // Recipients post created by requester used
        {
          id,
          visibility: PostVisibility.RECIPIENTS,
          recipients: ArrayContains([requester]) // Recipients post where requester is recipient
        }
      ];
      const isSubscribed = await this.coredinContractService.isWalletSubscribed(
        creatorWallet,
        requester
      );
      if (isSubscribed) {
        conditions.push({
          id,
          visibility: PostVisibility.PRIVATE,
          creatorWallet
        });
      }
      postWithReplies = await this.getWithRelations(conditions);
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

  async getDirectPosts(wallet: string) {
    return await this.postRepository.find({
      relations: ["user"],
      where: [
        {
          creatorWallet: wallet,
          replyToPostId: IsNull(),
          visibility: PostVisibility.RECIPIENTS
        },
        {
          replyToPostId: IsNull(),
          visibility: PostVisibility.RECIPIENTS,
          recipients: ArrayContains([wallet])
        }
      ],
      order: { createdAt: "DESC" }
    });
  }

  async create(wallet: string, data: CreatePostDTO) {
    if (data.recipients && data.recipients.length > 0) {
      if (data.visibility !== PostVisibility.RECIPIENTS || data.replyToPostId) {
        throw new BadRequestException(
          "Recipients can only be set for recipient visibility posts"
        );
      }

      const allSubscriptions = (
        await this.coredinContractService.getAllSubscriptions(wallet)
      ).map((subscription) => subscription.subscribed_to_wallet);
      const invalidRecipients = data.recipients.filter(
        (recipient) => !allSubscriptions.includes(recipient)
      );
      if (invalidRecipients.length > 0) {
        throw new BadRequestException(
          `Only subscribed profiles can be recipients, invalid profile found: ${invalidRecipients.join(", ")}`
        );
      }
    }

    if (
      data.visibility === PostVisibility.RECIPIENTS &&
      (!data.recipients || data.recipients.length === 0)
    ) {
      throw new BadRequestException(
        "Recipients must be set for recipient visibility posts"
      );
    }

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

  private async getWithRelations(where: FindOptionsWhere<Post>[]) {
    return await this.postRepository.findOne({
      relations: ["user", "parent", "parent.user", "replies", "replies.user"],
      where,
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

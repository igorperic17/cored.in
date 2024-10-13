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
  Not,
  Repository
} from "typeorm";
import { Post } from "./post.entity";
import {
  CreatePostDTO,
  PostDTO,
  PostDetailDTO,
  PostRequestType,
  PostVisibility
} from "@coredin/shared";
import { User } from "@/user/user.entity";
import { CoredinContractService, CoredinSignerService } from "@/coreum/services";
import { UserService } from "@/user/user.service";

const PAGE_SIZE = 10;

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @Inject(UserService)
    private readonly userService: UserService,
    @Inject(CoredinContractService)
    private readonly coredinContractService: CoredinContractService
  ) {}

  async get(
    id: number,
    creatorWallet: string,
    requesterWallet: string
  ): Promise<PostDetailDTO> {
    let postWithReplies = await this.getWithRelations([
      { id, visibility: PostVisibility.PUBLIC, creatorWallet }
    ]);

    // If public not found, look for recipient posts
    if (!postWithReplies) {
      const conditions = [
        {
          id,
          visibility: PostVisibility.RECIPIENTS,
          creatorWallet: requesterWallet
        }, // Recipients post created by requester used
        {
          id,
          visibility: PostVisibility.RECIPIENTS,
          recipientWallets: ArrayContains([requesterWallet]) // Recipients post where requester is recipient
        }
      ];
      postWithReplies = await this.getWithRelations(conditions);
    }

    // If still not found, look for private post if requester is subscriber
    if (!postWithReplies) {
      const isSubscribed = await this.coredinContractService.isWalletSubscribed(
        creatorWallet,
        requesterWallet
      );
      if (isSubscribed) {
        postWithReplies = await this.getWithRelations([
          {
            id,
            visibility: PostVisibility.PRIVATE,
            creatorWallet
          }
        ]);
      }
    }

    if (!postWithReplies) {
      throw new NotFoundException("Post not found");
    }

    const recipients =
      postWithReplies.recipientWallets.length > 0
        ? await this.userService.getPublicProfileList(
            postWithReplies.recipientWallets
          )
        : [];

    if (postWithReplies.unreadByWallets.includes(requesterWallet)) {
      await this.postRepository.update(
        { id: postWithReplies.id },
        {
          unreadByWallets: () =>
            `array_remove("unreadByWallets", '${requesterWallet}')`
        }
      );
    }

    return {
      ...this.fromDb(postWithReplies),
      parent: postWithReplies.parent
        ? this.fromDb(postWithReplies.parent)
        : undefined,
      // TODO - sort by createdAt in query, it requires using QueryBuilder
      replies: postWithReplies.replies
        .map((reply) => this.fromDb(reply))
        .sort((a, b) => a.createdAt.localeCompare(b.createdAt)),
      recipients
    };
  }

  // Not in use anymore, replaced by getPublicAndSubscribed
  // async getPublicFeed(): Promise<PostDTO[]> {
  //   return (
  //     await this.postRepository.find({
  //       relations: ["user"],
  //       where: {
  //         visibility: PostVisibility.PUBLIC,
  //         replyToPostId: IsNull()
  //       },
  //       order: { createdAt: "DESC" }
  //     })
  //   ).map((post) => this.fromDb(post));
  // }

  async getPublicAndSubscribedFeed(
    requesterWallet: string,
    page: number
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
          {
            feedScore: Not(IsNull()), // TODO?: apply migration to default null to 0 score
            visibility: PostVisibility.PUBLIC,
            replyToPostId: IsNull()
          },
          {
            creatorWallet: Any([...subscribedWallets, requesterWallet]),
            visibility: PostVisibility.PRIVATE,
            replyToPostId: IsNull()
          }
        ],
        order: { 
          feedScore: "DESC", 
          lastReplyDate: "DESC",
          createdAt: "DESC"
        },
        take: PAGE_SIZE,
        skip: PAGE_SIZE * (page - 1)
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
          replyToPostId: IsNull(),
          feedScore: Not(IsNull())
        },
        order: { feedScore: "DESC" }
      })
    ).map((post) => this.fromDb(post));
  }

  private async getAllUserPosts(creatorWallet: string): Promise<PostDTO[]> {
    return (
      await this.postRepository.find({
        relations: ["user"],
        where: {
          creatorWallet,
          replyToPostId: IsNull(),
          visibility: Not(PostVisibility.RECIPIENTS),
          feedScore: Not(IsNull())
        },
        order: { feedScore: "DESC" }
      })
    ).map((post) => this.fromDb(post));
  }

  async getPostsWithRecipients(requesterWallet: string): Promise<PostDTO[]> {
    const posts = await this.postRepository.find({
      relations: ["user"],
      where: [
        {
          creatorWallet: requesterWallet,
          replyToPostId: IsNull(),
          visibility: PostVisibility.RECIPIENTS
        },
        {
          replyToPostId: IsNull(),
          visibility: PostVisibility.RECIPIENTS,
          recipientWallets: ArrayContains([requesterWallet])
        }
      ],
      // messages should ignore the feed score ordering
      order: { lastReplyDate: "DESC", createdAt: "DESC" }
    });

    const recipients = await this.userService.getPublicProfileList(
      posts.map((post) => post.recipientWallets).flat()
    );

    // TODO - eventually we could just have one query to get all posts and recipients
    // const query = this.postRepository
    //   .createQueryBuilder("post")
    //   .leftJoinAndSelect(User, "user", "post.creatorWallet = user.wallet")
    //   // .leftJoinAndSelect(
    //   //   User,
    //   //   "recipients",
    //   //   "ANY(post.recipientWallets) = user.wallet"
    //   // )
    //   .where(
    //     '"replyToPostId" = NULL AND visibility = :visibility AND (post.creatorWallet = :wallet OR post.recipientWallets @> ARRAY[:wallet])',
    //     { wallet, visibility: PostVisibility.RECIPIENTS }
    //   )
    //   .orderBy("post.createdAt", "DESC")
    //   .getMany();

    return posts.map((post) => {
      return {
        ...this.fromDb(post, requesterWallet),
        recipients: recipients.filter((recipient) =>
          post.recipientWallets.includes(recipient.wallet)
        )
      };
    });
  }


  async getJobsFor(requesterWallet: string): Promise<PostDTO[]> {
    const posts = await this.postRepository.find({
      relations: ["user"],
      where: [
        {
          requestType: PostRequestType.JOB,
        },
        {
          feedScore: Not(IsNull())
        }
      ],
      order: { feedScore: "DESC" }
    });

    return posts.map(post => ({
      ...post,
      creatorUsername: post.user.username,
      creatorAvatar: post.user.avatarUrl,
      creatorAvatarFallbackColor: post.user.avatarFallbackColor ? post.user.avatarFallbackColor : '',
      createdAt: post.createdAt.toString(),
      lastReplyDate: post.lastReplyDate ? post.lastReplyDate.toString() : undefined
    }));
  }

  async create(requesterWallet: string, data: CreatePostDTO) {
    let parentPost: Post | undefined;
    if (data.replyToPostId) {
      parentPost = await this.validateReplyAndGetParentPost(
        data.replyToPostId,
        requesterWallet
      );
    }

    if (data.recipientWallets && data.recipientWallets.length > 0) {
      if (data.visibility !== PostVisibility.RECIPIENTS || data.replyToPostId) {
        throw new BadRequestException(
          "Recipients can only be set for recipient visibility posts"
        );
      }

      const allSubscriptions = (
        await this.coredinContractService.getAllSubscriptions(requesterWallet)
      ).map((subscription) => subscription.subscribed_to_wallet);
      const invalidRecipients = data.recipientWallets.filter(
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
      (!data.recipientWallets || data.recipientWallets.length === 0)
    ) {
      throw new BadRequestException(
        "Recipients must be set for recipient visibility posts"
      );
    }

    if (data.replyToPostId && parentPost) {
      await this.postRepository.update(
        { id: data.replyToPostId },
        {
          unreadByWallets: [
            ...parentPost.recipientWallets,
            parentPost.creatorWallet
          ].filter((wallet) => wallet !== requesterWallet),
          lastReplyDate: new Date()
        }
      );
    }

    const creationDate = new Date();
     
     // Recalculate the score based on the updated tip amount and last tip time
     const newFeedScore = this.calculateScore(0, null, creationDate, creationDate);

    return await this.postRepository.insert({
      feedScore: newFeedScore,
      creatorWallet: requesterWallet,
      createdAt: creationDate,
      lastReplyDate: creationDate,
      unreadByWallets: data.recipientWallets,
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

  async updateTip(postId: number) {
    const post = await this.postRepository.findOne({ where: { id: postId } });
    if (!post) {
      throw new Error('Post not found');
    }

    const currentTips = await this.coredinContractService.getPostTips(post.id);
    const amount = Number(currentTips);
    
    // Update the last tip time to now
    // TODO: in case of indexing in the future, the last tip time
    //       should be extracted from the contract
    const lastTipDate = new Date(Date.now());
    
    // Recalculate the score based on the updated tip amount and last tip time
    const newFeedScore = this.calculateScore(amount, lastTipDate, post.createdAt, lastTipDate);
    
    return await this.postRepository.manager.transaction(
      "SERIALIZABLE",
      async (transactionalEntityManager) => {
        await transactionalEntityManager.update(
          Post,
          { id: postId },
          {
            tips: amount,
            feedScore: newFeedScore
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
  private fromDb(post: Post, requesterWallet?: string): PostDTO {
    return {
      id: post.id,
      creatorWallet: post.creatorWallet,
      creatorUsername: post.user.username,
      creatorAvatar: post.user.avatarUrl,
      tips: post.tips,
      creatorAvatarFallbackColor: post.user.avatarFallbackColor,
      visibility: post.visibility,
      text: post.text,
      createdAt: post.createdAt.toISOString(),
      lastReplyDate: post.lastReplyDate?.toISOString(),
      likes: post.likes,
      skillTags: post.skillTags,
      replyToPostId: post.replyToPostId,
      requestType: post.requestType,
      requestExpiration: post.requestExpiration,
      unread: requesterWallet
        ? post.unreadByWallets.includes(requesterWallet)
        : undefined,
      feedScore: post.feedScore ?? 0.0,
    };
  }

  private async validateReplyAndGetParentPost(
    parentPostId: number,
    requesterWallet: string
  ): Promise<Post> {
    const post = await this.postRepository.findOne({
      where: {
        id: parentPostId
      }
    });
    if (!post) {
      console.error("Parent post not found", parentPostId, requesterWallet);
      throw new BadRequestException("Post not found");
    }

    // Private posts can only be replied to by the creator or subscribers
    if (
      post.visibility === PostVisibility.PRIVATE &&
      post.creatorWallet !== requesterWallet
    ) {
      const isSubscribed = await this.coredinContractService.isWalletSubscribed(
        post.creatorWallet,
        requesterWallet
      );
      if (!isSubscribed) {
        console.error(
          "Trying to post a reply to a private non subscribed profile",
          parentPostId,
          requesterWallet
        );

        throw new BadRequestException("Post not found");
      }
    }

    // Recipients posts can only be replied to by the creator or recipients
    if (
      post.visibility === PostVisibility.RECIPIENTS &&
      post.creatorWallet !== requesterWallet &&
      !post.recipientWallets.includes(requesterWallet)
    ) {
      console.error(
        "Trying to post a reply to a post where requester is not a recipient",
        parentPostId,
        requesterWallet
      );
      if (!post.recipientWallets.includes(requesterWallet)) {
        throw new BadRequestException("Post not found");
      }
    }

    // Only creators that are still subscribed to a given profile can reply to their posts
    if (
      post.visibility === PostVisibility.RECIPIENTS &&
      post.creatorWallet === requesterWallet
    ) {
      for (const recipient of post.recipientWallets) {
        const isSubscribed =
          await this.coredinContractService.isWalletSubscribed(
            recipient,
            requesterWallet
          );
        if (!isSubscribed) {
          console.error(
            "Trying to post a reply to a recipients posts by the creator which is no longer subscribed",
            parentPostId,
            post.recipientWallets,
            requesterWallet
          );

          throw new BadRequestException("Post not found");
        }
      }
    }

    return post;
  }

  // Function to calculate the current score, including base score and decaying factor
  calculateScore(
    totalTipAmount: number,
    lastTipTime: Date | null,  // Could be null if no tips
    creationTime: Date,        // Scriptohost's Date class
    lastComputedTime: Date,    // Last time the score was updated
    alpha: number = 0.1,       // tip amount weight 
    beta: number = 1.0,        // last tip timestamp weight
    gamma: number = 2.0,       // creation timestamp weight
    decayConstant: number = 0.001  // Lambda decay constant
  ): number {
    const now = new Date();

    // Calculate hours since last tip (if there's no tip, set the contribution to 0)
    let hoursSinceLastTip = 0;
    if (lastTipTime) {
      const timeDiffMillis = now.getTime() - lastTipTime.getTime();
      hoursSinceLastTip = timeDiffMillis / (1000 * 60 * 60);  // Convert milliseconds to hours
    }

    // Calculate hours since creation
    const creationTimeDiffMillis = now.getTime() - creationTime.getTime();
    const hoursSinceCreation = creationTimeDiffMillis / (1000 * 60 * 60);  // Convert milliseconds to hours

    // Calculate the base score:
    const tipScore = Math.log(1 + totalTipAmount);
    const recencyLastTipScore = lastTipTime ? (1 / (1 + hoursSinceLastTip)) : 0;
    const recencyCreationScore = 1 / (1 + hoursSinceCreation);

    // Combine components into the base score
    const baseScore = alpha * tipScore + beta * recencyLastTipScore + gamma * recencyCreationScore;

    // Apply the decaying factor based on the last computed time
    const timeDiffMillis = now.getTime() - lastComputedTime.getTime();
    const hoursSinceLastUpdate = timeDiffMillis / (1000 * 60 * 60);  // Convert to hours

    // Apply the exponential decay to the base score
    const decayingScore = baseScore * Math.exp(-decayConstant * hoursSinceLastUpdate);

    return decayingScore;
  }

  async recalculateAllFeedScores(wallet: string): Promise<void> {
    const posts = await this.postRepository.find();
    for (const post of posts) {
      const score = this.calculateScore(
        post.tips,
        post.lastTipDate,
        post.createdAt,
        post.lastTipDate // assume this was the latest update
      );
      post.feedScore = score;
      await this.postRepository.save(post);
    }
  }

}

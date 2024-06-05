import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./user.entity";
import { NotFoundError, UserProfile, UpdateProfileDTO } from "@coredin/shared";
import { Effect } from "effect";
import { WaltIdWalletService } from "../ssi/core/services";
import { CoredinContractService } from "@/coreum/services";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(WaltIdWalletService)
    private readonly waltId: WaltIdWalletService,
    @Inject(CoredinContractService)
    private readonly coredinContractService: CoredinContractService
  ) {}

  async get(
    wallet: string
  ): Promise<Effect.Effect<UserProfile, NotFoundError>> {
    const user = await this.userRepository.findOne({
      where: { wallet },
      relations: ["posts"]
    });
    if (user) {
      // Get DID
      const did = await this.waltId.getOrCreateDid(wallet);
      return Effect.succeed({
        username: user.username || "no_username",
        did: did.did,
        likedPosts: user.likedPosts,
        avatarUrl: user.avatarUrl,
        avatarFallbackColor: user.avatarFallbackColor,
        backgroundColor: user.backgroundColor,
        bio: user.bio
      });
    }

    return Effect.fail(new NotFoundError());
  }

  async updateLastSeen(wallet: string) {
    return this.userRepository.upsert({ wallet, lastSeen: new Date() }, [
      "wallet"
    ]);
  }

  async updateProfile(wallet: string, profile: UpdateProfileDTO) {
    const onchainProfile =
      await this.coredinContractService.getWalletInfo(wallet);

    return this.userRepository.update(
      { wallet },
      { ...profile, username: onchainProfile.did_info?.username }
    );
  }
}

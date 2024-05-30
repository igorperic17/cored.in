import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./user.entity";
import { NotFoundError, UserProfile } from "@coredin/shared";
import { Effect } from "effect";
import { WaltIdWalletService } from "../ssi/core/services";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(WaltIdWalletService)
    private readonly waltId: WaltIdWalletService
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
      // TODO - get username from chain? or just remove from backend or duplicate? To discuss if rename is gonna be possible or not..
      return Effect.succeed({
        username: user.profile?.username || "",
        did: did.did
      });
    }

    return Effect.fail(new NotFoundError());
  }

  async updateLastSeen(wallet: string) {
    return this.userRepository.upsert({ wallet, lastSeen: new Date() }, [
      "wallet"
    ]);
  }

  async updateProfile(wallet: string, profile: UserProfile) {
    return this.userRepository.update({ wallet }, { profile });
  }
}

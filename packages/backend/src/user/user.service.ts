import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./user.entity";
import { NotFoundError, UserProfile } from "@coredin/shared";
import { Effect } from "effect";
import { WaltIdWalletService } from "../ssi/core/services";

const NULL_USER_PROFILE: UserProfile = {
  firstName: null,
  lastName: null,
  secondLastName: null,
  birthDate: null,
  nationality: null,
  idNumber: null,
  email: null,
  phoneNumber: null
};

type UserWithDid = {
  profile: UserProfile;
  did: string;
};

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
  ): Promise<Effect.Effect<UserWithDid, NotFoundError>> {
    const user = await this.userRepository.findOne({ where: { wallet } });
    if (user) {
      console.log("user from db ", user);
      // Get DID
      const did = await this.waltId.getOrCreateDid(wallet);
      console.log(did);
      // Init null profile
      const profile = { ...NULL_USER_PROFILE, ...(user.profile || {}) };
      return Effect.succeed({ profile, did: did.did });
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

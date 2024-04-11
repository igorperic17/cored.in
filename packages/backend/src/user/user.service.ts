import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./user.entity";
import { UserProfile } from "@coredin/shared";

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

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async get(wallet: string) {
    const user = await this.userRepository.findOne({ where: { wallet } });
    if (user) {
      console.log("user from db ", user);
      // Init null profile
      user.profile = { ...NULL_USER_PROFILE, ...(user.profile || {}) };

      return user;
    }

    return null;
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

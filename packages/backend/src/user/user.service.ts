import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./user.entity";
import { NotFoundError, UserProfile, UpdateProfileDTO } from "@coredin/shared";
import { Effect } from "effect";
import { WaltIdIssuerService, WaltIdWalletService } from "../ssi/core/services";
import { CoredinContractService } from "@/coreum/services";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(WaltIdWalletService)
    private readonly walletService: WaltIdWalletService,
    @Inject(WaltIdIssuerService)
    private readonly issuerService: WaltIdIssuerService,
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
      let didKeyId = user.didKeyId;
      if (!user.didKeyId) {
        const generateDidKeyResult =
          await this.walletService.generateKey(wallet);
        console.log(
          "Generated DID key for wallet,",
          wallet,
          generateDidKeyResult
        );
        didKeyId = generateDidKeyResult;
        await this.userRepository.update({ wallet }, { didKeyId });
      }
      // Get DID
      const did = await this.walletService.getOrCreateDid(wallet, didKeyId);
      return Effect.succeed({
        username: user.username || "no_username",
        did: did?.did || "",
        likedPosts: user.likedPosts,
        avatarUrl: user.avatarUrl,
        avatarFallbackColor: user.avatarFallbackColor,
        backgroundColor: user.backgroundColor,
        bio: user.bio,
        issuerDid: user.issuerDid
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

  async grantIssuerDid(wallet: string) {
    const user = await this.userRepository.findOne({
      where: { wallet }
    });
    if (!user) {
      console.error("User not found white trying to grand issuerDid!", wallet);
      throw new NotFoundException("User not found");
    }
    if (user.issuerDid) {
      console.error("User already has an issuerDid! ", wallet);
      return false;
    }
    const issuerData = await this.issuerService.onboardIssuer(wallet);
    const updateResult = await this.userRepository.update(
      { wallet },
      { issuerDid: issuerData.issuerDid, issuerKeyId: issuerData.issuerKey.id }
    );

    return updateResult.affected === 1;
  }
}

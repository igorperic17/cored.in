import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./user.entity";
import {
  NotFoundError,
  UserProfile,
  UpdateProfileDTO,
  CredentialDTO
} from "@coredin/shared";
import { Effect } from "effect";
import { WaltIdIssuerService, WaltIdWalletService } from "../ssi/core/services";
import { CoredinContractService } from "@/coreum/services";
import { MerkleTree } from "merkletreejs";
import { keccak256 } from "@ethersproject/keccak256";
import { VerifiableCredential } from "@/ssi/core/data-classes";

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

  async getPrivate(
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
      const credentials = await this.walletService.getVCs(wallet);
      return Effect.succeed({
        username: user.username || "no_username",
        did: did?.did || "",
        likedPosts: user.likedPosts,
        avatarUrl: user.avatarUrl,
        avatarFallbackColor: user.avatarFallbackColor,
        backgroundColor: user.backgroundColor,
        bio: user.bio,
        issuerDid: user.issuerDid,
        credentials: this.adaptCredentials(credentials),
        credentialsMerkleRoot: this.genereateMerkleTree(credentials)
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

  private adaptCredentials(rawVCs: VerifiableCredential[]): CredentialDTO[] {
    return rawVCs.map((vc) => ({
      id: vc.id,
      type: vc.parsedDocument.type[1],
      issuer: vc.parsedDocument.issuer.id,
      title: vc.parsedDocument.credentialSubject.title,
      establishment: vc.parsedDocument.credentialSubject.establishment,
      startDate: vc.parsedDocument.credentialSubject.startDate,
      endDate: vc.parsedDocument.credentialSubject.endDate,
      verified: true
    }));
  }

  private genereateMerkleTree(rawVCs: VerifiableCredential[]) {
    const leaves = rawVCs.map((vc) => {
      return keccak256(Buffer.from(vc.id));
    });

    const leavesRaw = rawVCs.map((vc) => {
      return vc.id;
    });
    // console.log("rawVCs", rawVCs);

    console.log("leaves", leavesRaw);

    // const leaves = ["a", "b", "c"].map((vc) => {
    //   return keccak256(vc);
    // });

    const tree = new MerkleTree(leaves, keccak256, { sort: true });
    const root = tree.getHexRoot().substring(2); // remove 0x since not needed for WASM contract

    const leaf = leaves[0];
    console.log(leaf);
    const proof = tree.getHexProof(leaf); // .map((p) => p.substring(2));
    // const proof = [
    //   { position: "right", data: Buffer.from("proof1") },
    //   { position: "right", data: Buffer.from("proof2") }
    // ];
    console.log("root", root, "leaf", leaf, "proof", proof);
    // console.log("verify", tree.verify(proof .map((p) => p.substring(2)), leaf, root.substring(2)));
    return root;
  }
}

import { tags } from "typia";
import { CredentialDTO, DID, HexColor, PhotoUrl, ShortString } from "..";

export interface PublicUserProfile {
  wallet: string;
  username: ShortString;
  avatarUrl?: PhotoUrl;
  avatarFallbackColor?: HexColor;
  backgroundColor?: HexColor;
  bio?: string & tags.MaxLength<250>;
  issuerDid?: string;
}

export interface UserProfile extends PublicUserProfile {
  did?: DID;
  likedPosts: number[];
  credentials: CredentialDTO[];
  // credentialsMerkleRoot: string;
}

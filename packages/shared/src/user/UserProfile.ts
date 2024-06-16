import { tags } from "typia";
import { CredentialDTO, HexColor, PhotoUrl, ShortString } from "..";

export interface UserProfile {
  username: ShortString;
  did: string;
  likedPosts: number[];
  avatarUrl?: PhotoUrl;
  avatarFallbackColor?: HexColor;
  backgroundColor?: HexColor;
  bio?: string & tags.MaxLength<250>;
  issuerDid?: string;
  credentials: CredentialDTO[];
  credentialsMerkleRoot: string;
}

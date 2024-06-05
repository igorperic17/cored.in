import { tags } from "typia";
import { HexColor, PhotoUrl } from "..";

export interface UpdateProfileDTO {
  avatarUrl?: PhotoUrl;
  avatarFallbackColor?: HexColor;
  backgroundColor?: HexColor;
  bio?: string & tags.MaxLength<250>;
}

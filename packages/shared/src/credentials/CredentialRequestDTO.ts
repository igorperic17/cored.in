import { PublicUserProfile } from "@/user";
import { CredentialDTO } from "./CredentialDTO";
import { CredentialRequestStatus } from "./CredentialRequestStatus";

export type CredentialRequestDTO = {
  request: CredentialDTO;
  requester: PublicUserProfile;
  createdAt: string;
  status: CredentialRequestStatus;
};

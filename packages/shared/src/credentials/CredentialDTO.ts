import { CredentialType } from "./CredentialTypes";

export type CredentialDTO = {
  id: number;
  type: CredentialType;
  title: string;
  establishment: string;
  startDate: string;
  endDate?: string;
  verified: boolean;
  issuer?: string;
};

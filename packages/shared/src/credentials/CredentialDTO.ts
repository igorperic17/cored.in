export type CredentialDTO = {
  id: number;
  title: string;
  establishment: string;
  startDate: string;
  endDate?: string;
  verified: boolean;
  issuer?: string;
};

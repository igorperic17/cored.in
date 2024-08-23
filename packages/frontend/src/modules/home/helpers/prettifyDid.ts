import { ProfileInfo } from "@coredin/shared";

export const prettifyDid = (did: ProfileInfo["did"]) => {
  return did.slice(0, 7) + "..." + did.slice(-6);
};

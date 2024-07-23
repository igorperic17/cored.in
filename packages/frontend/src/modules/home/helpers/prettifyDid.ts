import { DidInfo } from "@coredin/shared";

export const prettifyDid = (did: DidInfo["did"]) => {
  return did.slice(0, 7) + "..." + did.slice(-12);
};

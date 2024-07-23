import { DidInfo } from "@coredin/shared";

export const prettifyDid = (did: DidInfo["did"]) => {
  return did.slice(0, 14) + "..." + did.slice(-6);
};

import { issuerService } from "@/dependencies";
import { BaseServerStateKeys } from "../constants";

export const ISSUER_QUERIES = {
  getAll: () => ({
    queryKey: [BaseServerStateKeys.ISSUERS],
    queryFn: () => issuerService.getAll()
  })
};

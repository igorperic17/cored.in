import { CoredinClient } from "@coredin/shared";

export class CoredinSignerService {
  constructor(private readonly coredinClient: CoredinClient) {}

  async register(did: string, username: string) {
    return this.coredinClient.register({ did, username });
  }
}

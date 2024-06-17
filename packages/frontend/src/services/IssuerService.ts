import { HttpService } from "@/services";
import { UserProfile } from "@coredin/shared";

export class IssuerService {
  constructor(private readonly http: HttpService) {}

  async getAll(): Promise<UserProfile[]> {
    return this.http.get("issuers");
  }

  //   async requestIssuance() {
  //     return this.http.post("issuers/requestIssuance");
  //   }
}

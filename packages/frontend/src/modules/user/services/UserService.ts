import { HttpService } from "@/services";
import { UserProfile } from "@coredin/shared";

export class UserService {
  constructor(private readonly http: HttpService) {}

  async getUser(): Promise<{ profile: UserProfile }> {
    return this.http.get("user");
  }

  async updateProfile(profile: UserProfile): Promise<void> {
    return this.http.post("user", profile);
  }
}

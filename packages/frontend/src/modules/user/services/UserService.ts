import { HttpService } from "@/services";
import { UpdateProfileDTO, UserProfile } from "@coredin/shared";

export class UserService {
  constructor(private readonly http: HttpService) {}

  async getUser(): Promise<UserProfile> {
    return this.http.get("user");
  }

  async updateProfile(profile: UpdateProfileDTO): Promise<void> {
    return this.http.post("user", profile);
  }

  async deleteCredential(id: string, permanent: boolean): Promise<void> {
    return this.http.delete(`user/credentials/${id}?permanent=${permanent}`);
  }
}

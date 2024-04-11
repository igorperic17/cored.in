import { userService } from "@/dependencies";
import { UserProfile } from "@coredin/shared";
import { BaseServerStateKeys } from "../constants";

export const USER_MUTATIONS = {
  updateProfile: () => ({
    mutationKey: [BaseServerStateKeys.UPDATE_PROFILE],
    mutationFn: ({ profile }: { profile: UserProfile }) =>
      userService.updateProfile(profile)
  })
};

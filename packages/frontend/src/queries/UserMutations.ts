import { userService } from "@/dependencies";
import { UpdateProfileDTO } from "@coredin/shared";
import { BaseServerStateKeys } from "../constants";

export const USER_MUTATIONS = {
  updateProfile: () => ({
    mutationKey: [BaseServerStateKeys.UPDATE_PROFILE],
    mutationFn: ({ profile }: { profile: UpdateProfileDTO }) =>
      userService.updateProfile(profile)
  })
};

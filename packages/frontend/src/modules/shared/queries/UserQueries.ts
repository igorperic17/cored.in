import { userService } from "@/dependencies";
import { BaseServerStateKeys } from "../constants";

export const USER_QUERIES = {
  getUser: (user: string, needsAuth: boolean) => ({
    queryKey: [BaseServerStateKeys.USER, user, needsAuth.toString()],
    queryFn: () => userService.getUser()
  })
};

import {
  AuthService,
  HttpService,
  StorageService
} from "./modules/shared/services";
import { UserService } from "./modules/user/services";

export const persistentStorageService = new StorageService();
const baseApiUrl = "/api/";
const httpService = new HttpService(baseApiUrl);
export const authService = new AuthService(baseApiUrl);
export const userService = new UserService(httpService);

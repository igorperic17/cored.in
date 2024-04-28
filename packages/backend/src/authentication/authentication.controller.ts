import { Controller, HttpException, HttpStatus } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { MaxLoginDurationMs } from "./constants";
import { TypedBody, TypedRoute } from "@nestia/core";

interface LoginRequest {
  walletAddress: string;
  pubKey: string;
  signature: string;
  expiration: number;
};

@Controller("authentication")
export class AuthenticationController {
  constructor(private readonly jwtService: JwtService) {}

  @TypedRoute.Post("/login")
  async login(@TypedBody() loginRequest: LoginRequest): Promise<string> {
    console.log("Login requested", loginRequest);
    if (!loginRequest.signature || loginRequest.signature.length < 10) {
      throw new HttpException("Wrong signature length", HttpStatus.FORBIDDEN);
    }
    if (
      !loginRequest.expiration ||
      loginRequest.expiration > Date.now() + MaxLoginDurationMs
    ) {
      throw new HttpException("Invalid Expiration", HttpStatus.FORBIDDEN);
    }
    const jwt = this.jwtService.sign({
      ...loginRequest
    });

    return Promise.resolve(jwt);
  }
}

import {
  Controller,
  Body,
  Post,
  HttpException,
  HttpStatus
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { MaxLoginDurationMs } from "./constants";

type LoginRequest = {
  signature: string;
  expiration: number;
};

@Controller("authentication")
export class AuthenticationController {
  constructor(private readonly jwtService: JwtService) {}

  @Post("/login")
  async login(@Body() loginRequest: LoginRequest): Promise<string> {
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
      signature: loginRequest.signature,
      expiration: loginRequest.expiration
    });

    return Promise.resolve(jwt);
  }
}

import { Injectable, NestMiddleware } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request, Response, NextFunction } from "express";
import { WALLET_HEADER, MaxLoginDurationMs, LoginMessage } from "../constants";
import * as Cosmos from "@keplr-wallet/cosmos";
import { TESTNET_CHAIN_BECH32_PREFIX } from "@coredin/shared";

@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  use(req: Request, _: Response, next: NextFunction) {
    this.addJwtPropertiesToHeaders(req);
    next();
  }

  private addJwtPropertiesToHeaders(req: Request) {
    // Clear the header, in case it's set from the outside
    req.headers[WALLET_HEADER] = undefined;

    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return;
    }

    const jwt = authHeader.split(" ")[1];
    let decodedJwt;
    try {
      decodedJwt = this.jwtService.verify(jwt);
    } catch (e) {
      return;
    }

    const now = Date.now();
    if (decodedJwt.expiration < now) {
      return;
    }

    // Adding one day to max allowed timestamp to avoid using with users with unsynced clocks / wrong timezones
    // This implies we allow logins up to loginDurationMs + one day (currently 8 days in total)
    const oneDayLoginMarginMs = 24 * 60 * 60 * 1000;
    if (
      decodedJwt.expiration >
      now + MaxLoginDurationMs + oneDayLoginMarginMs
    ) {
      return;
    }

    const message = LoginMessage + decodedJwt.expiration;
    const { signature, pubKey, walletAddress } = decodedJwt;

    const signatureBuffer = Buffer.from(signature, "base64");
    const uint8Signature = new Uint8Array(signatureBuffer); // Convert the buffer to an Uint8Array
    const pubKeyValueBuffer = Buffer.from(pubKey, "base64"); // Decode the base64 encoded value
    const pubKeyUint8Array = new Uint8Array(pubKeyValueBuffer); // Convert the buffer to an Uint8Array
    const isRecovered = Cosmos.verifyADR36Amino(
      TESTNET_CHAIN_BECH32_PREFIX,
      walletAddress,
      message,
      pubKeyUint8Array,
      uint8Signature
    );

    if (isRecovered) {
      req.headers[WALLET_HEADER] = walletAddress;
    }
  }
}

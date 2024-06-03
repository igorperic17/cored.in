import axios from "axios";

export class WaltIdIssuerService {
  constructor(private readonly issuerApiUrl: string) {}

  async onboardIssuer(wallet: string) {
    const createIssuerKeyResult = await axios.post(
      `${this.issuerApiUrl}/onboard/issuer`,
      {
        issuerKeyConfig: {
          type: "jwk",
          algorithm: "secp256r1"
        },
        issuerDidConfig: {
          method: "jwk"
        }
      }
    );

    console.log("Created issuer for wallet,", wallet);
    // TODO - store issuerDID somewhere safe
    console.dir(createIssuerKeyResult.data, { depth: 10 });
  }
}

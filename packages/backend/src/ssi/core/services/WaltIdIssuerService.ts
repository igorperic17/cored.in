import axios from "axios";

export type IssuerInfo = {
  issuerDid: string;
  issuerKey: {
    type: string;
    jwk: string;
  };
};

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

  async getCredentialOfferUrl(subjectDid: string, issuerInfo: IssuerInfo) {
    const payload = this.generateCredentialPayload(subjectDid, issuerInfo);
    const createCredentialOfferResult = await axios.post(
      `${this.issuerApiUrl}/openid4vc/jwt/issue`,
      payload,
      {
        headers: {
          Accept: "text/plain",
          "Content-Type": "application/json"
        }
      }
    );

    return createCredentialOfferResult.data;
  }

  // TODO - properly handle different issuers, credential types etc..
  private generateCredentialPayload(
    subjectDid: string,
    issuerInfo: IssuerInfo
  ): string {
    return JSON.stringify({
      ...issuerInfo,
      vc: {
        "@context": [
          "https://www.w3.org/2018/credentials/v1",
          "https://www.w3.org/2018/credentials/examples/v1"
        ],
        type: ["VerifiableCredential", "UniversityDegreeCredential"],
        issuer: {
          id: "did:web:vc.transmute.world"
        },
        issuanceDate: "2020-03-10T04:24:12.164Z",
        credentialSubject: {
          id: subjectDid,
          degree: {
            type: "BachelorDegree",
            name: "Bachelor of Science and Arts"
          }
        }
      },
      mapping: {
        id: "<uuid>",
        issuer: {
          id: "<issuerDid>"
        },
        credentialSubject: {
          id: "<subjectDid>"
        },
        issuanceDate: "<timestamp>",
        expirationDate: "<timestamp-in:365d>"
      }
    });
  }
}

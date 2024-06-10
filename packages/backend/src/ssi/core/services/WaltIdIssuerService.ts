import axios from "axios";

export type IssuerInfo = {
  issuerDid: string;
  issuerKeyVaultId: string;
};

export class WaltIdIssuerService {
  constructor(
    private readonly issuerApiUrl: string,
    private readonly vaultUrl: string,
    private readonly vaultAccessKey: string
  ) {}

  async onboardIssuer(wallet: string) {
    const createIssuerKeyResult = await axios.post(
      `${this.issuerApiUrl}/onboard/issuer`,
      {
        key: {
          backend: "tse",
          keyType: "Ed25519",
          config: {
            server: this.vaultUrl + "/v1/transit",
            accessKey: this.vaultAccessKey
          }
        },
        did: {
          method: "key"
        }
      }
    );
    console.log("Onboarded issuer for wallet,", wallet);

    return createIssuerKeyResult.data;
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
      issuerKey: {
        type: "tse",
        server: this.vaultUrl + "/v1/transit",
        accessKey: this.vaultAccessKey,
        id: issuerInfo.issuerKeyVaultId
      },
      issuerDid: issuerInfo.issuerDid,
      credentialConfigurationId: "UniversityDegree_jwt_vc_json",
      credentialData: {
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

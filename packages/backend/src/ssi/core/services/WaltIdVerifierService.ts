import axios from "axios";

export class WaltIdVerifierService {
  constructor(private readonly verifierApiUrl: string) {}

  async requestPresentation(credentialType: string) {
    const response = await axios.post(
      `${this.verifierApiUrl}/openid4vc/verify`,
      {
        request_credentials: [credentialType]
      }
    );

    return response.data;
  }
}

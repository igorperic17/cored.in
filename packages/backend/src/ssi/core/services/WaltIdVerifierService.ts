import axios from "axios";

export class WaltIdVerifierService {
  constructor(private readonly verifierApiUrl: string) {}

  async requestPresentation(credentialType: string) {
    const response = await axios.post(
      `${this.verifierApiUrl}/openid4vc/verify`,
      {
        request_credentials: [credentialType]
      },
      {
        headers: {
          responseMode: "direct_post"
        }
      }
    );

    return response.data;
  }

  async getPresentationState(state: string) {
    const response = await axios.get(
      `${this.verifierApiUrl}/openid4vc/session/` + state
    );

    return response.data;
  }
}

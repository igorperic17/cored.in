import { Did, Wallet } from "../data-classes";
import axios from "axios";

export class WaltIdWalletService {
  constructor(
    private readonly walletApiUrl: string,
    private readonly vaultUrl: string,
    private readonly vaultAccessKey: string
  ) {}

  async getOrCreateDid(wallet: string, didKeyId: string) {
    const dids = await this.getDids(wallet);
    const did = dids.find((did) => did.keyId === didKeyId);
    if (did) {
      return did;
    }
    await this.createDid(wallet, didKeyId);

    return (await this.getDids(wallet)).find((did) => did.keyId === didKeyId);
  }

  async getVCs(wallet: string) {
    const { token, ssiWallet } = await this.getSsiWallet(wallet);
    const targetUrl = `${this.walletApiUrl}/wallet-api/wallet/${ssiWallet}/credentials`;
    const response = await axios.get(targetUrl, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return response.data;
  }

  async useOfferRequest(wallet: string, did: string, offerRequest: string) {
    const { token, ssiWallet } = await this.getSsiWallet(wallet);
    const targetUrl = `${this.walletApiUrl}/wallet-api/wallet/${ssiWallet}/exchange/useOfferRequest?did=${did}&requireUserInput=false`;
    const offerResponse = await axios.post(targetUrl, offerRequest, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return offerResponse.data;
  }

  async usePresentationRequest(wallet: string, offerRequest: string) {
    const { presentationDefinition, state } =
      await this.decodePresentationURL(offerRequest);
    const { token, ssiWallet } = await this.getSsiWallet(wallet);
    const matchResponse = await this.matchCredentialsForPresentationDefinition(
      presentationDefinition,
      ssiWallet,
      token
    );
    const resolvedData = await this.resolvePresentationRequest(
      offerRequest,
      ssiWallet,
      token
    );

    const targetUrl = `${this.walletApiUrl}/wallet-api/wallet/${ssiWallet}/exchange/usePresentationRequest`;
    await axios.post(
      targetUrl,
      {
        did: matchResponse[matchResponse.length - 1].parsedDocument
          .credentialSubject.id,
        presentationRequest: resolvedData,
        selectedCredentials: [matchResponse[matchResponse.length - 1].id]
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    return state;
  }

  async getDids(wallet: string): Promise<Did[]> {
    const { token, ssiWallet } = await this.getSsiWallet(wallet);
    const targetUrl = `${this.walletApiUrl}/wallet-api/wallet/${ssiWallet}/dids`;
    const didsResponse = await axios.get(targetUrl, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    console.log("didsResponse", didsResponse.data);

    return didsResponse.data;
  }

  async generateKey(wallet: string) {
    const { token, ssiWallet } = await this.getSsiWallet(wallet);
    const targetUrl = `${this.walletApiUrl}/wallet-api/wallet/${ssiWallet}/keys/generate`;
    const createResponse = await axios.post(
      targetUrl,
      {
        backend: "tse",
        config: {
          server: this.vaultUrl + "/v1/transit",
          accessKey: this.vaultAccessKey
        },
        keyType: "Ed25519"
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    return createResponse.data;
  }

  async createDid(wallet: string, keyId: string) {
    const { token, ssiWallet } = await this.getSsiWallet(wallet);
    const targetUrl = `${this.walletApiUrl}/wallet-api/wallet/${ssiWallet}/dids/create/jwk?keyId=${keyId}&alias=coredin`;
    const createResponse = await axios.post(
      targetUrl,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    await axios.post(
      `${this.walletApiUrl}/wallet-api/wallet/${ssiWallet}/dids/default?did=${createResponse.data}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    return createResponse.data;
  }

  private async decodePresentationURL(offerURL: string): Promise<{
    presentationDefinition: string;
    state: string;
  }> {
    // Create URL object
    const url = new URL(offerURL);

    const state = url.searchParams.get("state");
    if (!state) {
      throw new Error("Invalid offerURL: state query parameter not found");
    }

    // Get `presentation_definition_uri` query parameter
    const offerParam = url.searchParams.get("presentation_definition_uri");
    if (!offerParam) {
      throw new Error(
        "Invalid offerURL: presentation_definition_uri query parameter not found"
      );
    }

    // Resolve the URL and get the result
    const response = await axios.get(offerParam);

    return { presentationDefinition: response.data, state };
  }

  private async matchCredentialsForPresentationDefinition(
    definition: unknown,
    wallet: string,
    token: string
  ) {
    const targetUrl = `${this.walletApiUrl}/wallet-api/wallet/${wallet}/exchange/matchCredentialsForPresentationDefinition`;
    const response = await axios.post(targetUrl, definition, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (response.data.length === 0) {
      throw new Error("No valid credentials found for presentation request");
    }

    return response.data;
  }

  private async resolvePresentationRequest(
    offerRequest: string,
    ssiWallet: string,
    token: string
  ) {
    const resolveUrl = `${this.walletApiUrl}/wallet-api/wallet/${ssiWallet}/exchange/resolvePresentationRequest`;
    const resolveResponse = await axios.post(resolveUrl, offerRequest, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return resolveResponse.data;
  }

  private async getWallets(
    wallet: string,
    token?: string
  ): Promise<{ wallets: Wallet[] }> {
    if (!token) {
      token = await this.getAuthToken(wallet, wallet);
    }
    const walletsResponse = await axios.get(
      `${this.walletApiUrl}/wallet-api/wallet/accounts/wallets`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    return walletsResponse.data;
  }

  private async getAuthToken(
    user: string,
    password: string,
    retry = true
  ): Promise<string> {
    return axios
      .post(`${this.walletApiUrl}/wallet-api/auth/login`, {
        type: "email",
        email: user,
        password: password
      })
      .then((response) => {
        return response.data.token;
      })
      .catch(async (error) => {
        if (retry) {
          try {
            await this.registerUser(user, password);
          } catch (error) {
            console.error(error);
          }
          return await this.getAuthToken(user, password, false);
        }
        console.error(error);

        throw error;
      });
  }

  private async registerUser(user: string, password: string) {
    return axios
      .post(`${this.walletApiUrl}/wallet-api/auth/create`, {
        name: user,
        email: user,
        password: password,
        type: "email"
      })
      .then(() => {
        return true;
      })
      .catch((error) => {
        console.error(error);

        return false;
      });
  }

  private async getSsiWallet(wallet: string) {
    const token = await this.getAuthToken(wallet, wallet);
    const wallets = await this.getWallets(wallet, token);
    const ssiWallet = wallets.wallets[0].id;

    return { token, ssiWallet };
  }
}

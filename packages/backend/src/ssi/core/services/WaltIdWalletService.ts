import { Did, Wallet } from "../data-classes";
import axios from "axios";

export class WaltIdWalletService {
  constructor(private readonly walletApiUrl: string) {}

  async getOrCreateDid(wallet: string) {
    const dids = await this.getDids(wallet);
    if (dids.length > 0) {
      return dids.find((did) => did.default) || dids[0];
    }

    await this.createDid(wallet);
    return (await this.getDids(wallet)).find((did) => did.default) || dids[0];
  }

  async getVCs(wallet: string) {
    const token = await this.getAuthToken(wallet, wallet);
    const wallets = await this.getWallets(wallet, token);
    const targetUrl = `${this.walletApiUrl}/wallet-api/wallet/${wallets.wallets[0].id}/credentials`;
    const response = await axios.get(targetUrl, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  }

  async useOfferRequest(wallet: string, offerRequest: string) {
    const token = await this.getAuthToken(wallet, wallet);
    const wallets = await this.getWallets(wallet, token);
    const targetUrl = `${this.walletApiUrl}/wallet-api/wallet/${wallets.wallets[0].id}/exchange/useOfferRequest?requireUserInput=false`;
    const offerResponse = await axios.post(targetUrl, offerRequest, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return offerResponse.data;
  }

  async getDids(wallet: string): Promise<Did[]> {
    const token = await this.getAuthToken(wallet, wallet);
    const wallets = await this.getWallets(wallet, token);
    const targetUrl = `${this.walletApiUrl}/wallet-api/wallet/${wallets.wallets[0].id}/dids`;
    const didsResponse = await axios.get(targetUrl, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return didsResponse.data;
  }

  async createDid(wallet: string) {
    const token = await this.getAuthToken(wallet, wallet);
    const wallets = await this.getWallets(wallet, token);
    const targetUrl = `${this.walletApiUrl}/wallet-api/wallet/${wallets.wallets[0].id}/dids/create/key`;
    const createResponse = await axios.post(
      targetUrl,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    return createResponse.data;
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
}

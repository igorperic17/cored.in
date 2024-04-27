import { Injectable } from "@nestjs/common";
import axios from "axios";

type Wallet = {
  id: string;
  name: string;
  permission: string;
  // These are actually timestamps but not required for the moment
  // addedOn: string;
  // createdOn: string;
};

type WalletsResponse = {
  wallets: Wallet[];
};

type Did = {
  did: string;
  alias: string;
  document: string;
  keyId: string;
  default: boolean;
  // This are actually timestamps but not required for the moment
  // createdOn: string
};

@Injectable()
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

  async getWallets(wallet: string, token?: string): Promise<WalletsResponse> {
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

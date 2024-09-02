export type MetamaskBTCRpcRequest = SaveLNMacaroon | GetLNDataFromSnap;

export enum BitcoinNetwork {
  Main = 'main',
  Test = 'test',
}

export enum KeyOptions {
  Password = 'password',
  Credential = 'credential',
  PubKey = 'pubkey',
}

const LightningAccount = Buffer.from('Lightning').readInt32BE();
export const LNHdPath = `m/84'/0'/${LightningAccount}'/0/0`;

export interface PersistedData {
  network?: BitcoinNetwork;
  lightning?: {
    [walletId: string]: {
      credential: string;
      password: string;
    };
  };
}

export interface SaveLNMacaroon {
  method: 'save_macaroon';
  params: Record<string, never>;
}

export interface GetLNDataFromSnap {
  method: 'getLNDataFromSnap';
  params: {
    key: KeyOptions;
    walletId: string;
    type: 'get' | 'refresh'
  };
}

export type LNDMethodCallback = (
  originString: string,
  requestObject: MetamaskBTCRpcRequest,
) => Promise<unknown>;

export interface Snap {
  registerRpcMessageHandler: (fn: LNDMethodCallback) => unknown;
  request<T>(options: {
    method: string;
    params?: unknown[] | Record<string, any>;
  }): Promise<T>;
}

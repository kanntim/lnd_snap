import { defaultSnapOrigin } from '../config';
import { MetaMaskInpageProvider } from '@metamask/providers';

declare global {
  interface Window {
    ethereum: MetaMaskInpageProvider;
  }
}

const { ethereum } = window;
const snapId = defaultSnapOrigin;

export async function useMacaroon<T>(
  cb: (macaroon: string) => Promise<T>,
): Promise<T> {

  let walletId = 'test';

  return await ethereum
    .request<string>({
      method: 'wallet_invokeSnap',
      params: {
        snapId,
        request: {
          method: 'getLNDataFromSnap',
          params: {
            key: 'credential',
            walletId: walletId,
            type: 'get',
          },
        },
      },
    })
    .then((res) => {
      const macaroon = res as unknown as string;
      return cb(macaroon);
    });
}

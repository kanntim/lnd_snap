
import { Snap, MetamaskBTCRpcRequest } from './interface';
import { requestMacaroon } from './rpc';
import { getLNDataFromSnap } from './rpc/getLNDataFromSnap';

declare let snap: Snap;

export type RpcRequest = {
  origin: string;
  request: MetamaskBTCRpcRequest;
};

export const onRpcRequest = async ({
  origin,
  request,
}: RpcRequest) => {
  switch (request.method) {
    case 'getLNDataFromSnap':
      return getLNDataFromSnap(
        origin,
        snap,
        {
          key: request.params.key,
          walletId: request.params.walletId,
          type: request.params.type,
        }
      );
    case 'save_macaroon':
      return requestMacaroon(snap);
    default:
      throw new Error('Method not found.');
  }
};

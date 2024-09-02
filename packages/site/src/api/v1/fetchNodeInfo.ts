import { query } from '../request-utils/query';
import { RequestType } from '../types';

const endpoint = '/v1/getinfo';

interface Address {
  address: string;
  hdPath: string;
}

interface OccupiedAddress extends Address {
  balance: string;
}

export interface FetchNodeInfoResponse {
  used: Address[];
}

export const fetchNodeInfo = (macaroon:string): Promise<FetchNodeInfoResponse> => {
    const headers = {"Grpc-Metadata-macaroon": macaroon};
  return query(endpoint, RequestType.Get, headers);
};

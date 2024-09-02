

import { Snap, PersistedData, KeyOptions, LNHdPath } from '../interface';
import { getPersistedData } from '../utils/manageState';
import { Box, Heading, Text } from '@metamask/snaps-sdk/jsx';

interface GetLNDataFromSnap {
  key: KeyOptions,
  walletId: string,
  type: 'get' | 'refresh',
}



export async function getLNDataFromSnap(
  domain: string,
  snap: Snap,
  {
    key,
    walletId,
    type = 'get',
  }: GetLNDataFromSnap
): Promise<string> {
  switch (key) {
    case KeyOptions.PubKey:
      return 'pubKey';
      //return (await getHDNode(snap, LNHdPath)).publicKey.toString('hex');
    case KeyOptions.Password:
      const lightning = await getPersistedData<PersistedData['lightning']>(
        snap,
        'lightning',
        {},
      );
      return lightning![walletId]?.password ?? '';
    case KeyOptions.Credential:
      const param = {
        get: {
          prompt: 'Access your Lighting wallet credentials',
          description: `Do you want to allow ${domain} to access your Lighting wallet credentials?`,
        },
        refresh: {
          prompt: 'Lightning Wallet Data has Expired.',
          description: 'For security purposes, Lightning Wallet data expires after 7 days and needs to be re-authorized.',
        }
      }[type]
      
      const result = await snap.request({
        method: 'snap_dialog',
        params: {
          type: 'confirmation',
          content: (
            <Box>
            <Heading>{param.prompt}</Heading>
            <Text>{param.description}</Text>
            </Box>
          ),
        },
  
      });
      
      if (result) {
        const lightning = await getPersistedData<PersistedData['lightning']>(
          snap,
          'lightning',
          {},
        );
        const encryptText = lightning![walletId]?.credential ?? '';


        return encryptText;
      } else {
        Error('Invalid key option');
      }
    default:
      throw Error('Invalid key option');
  }
}

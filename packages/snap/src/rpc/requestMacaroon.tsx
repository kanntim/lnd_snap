import { Box, Heading, Text, } from '@metamask/snaps-sdk/jsx'
import { Snap } from '../interface';
import { getPersistedData, updatePersistedData } from '../utils/manageState';

export async function requestMacaroon(snap: Snap): Promise<string | void> {

  const macaroon = await snap.request({
    method: 'snap_dialog',
    params: {
      type: 'prompt',
      content: (
        <Box>
          <Heading>Save your Macaroon</Heading>
          <Text>Enter here your LN macaroon</Text>
        </Box>
      ),
      placeholder: '13ce5...',
    },
  }) as unknown as string;


  console.log(macaroon.length)
  const result = await getPersistedData(snap, 'lightning', {});

  let walletId = 'test'
  const newLightning = {
    ...result,
    [walletId]: {
      credential: macaroon,
    },
  };

  await updatePersistedData(snap, 'lightning', newLightning);
}

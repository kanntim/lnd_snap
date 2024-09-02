import { RequestObject, RequestType } from '../types';
import axios, { AxiosResponse } from 'axios';
import { TIME_OUT } from '../constant';
import * as querystring from 'querystring';

import { useInvokeSnap } from '../../hooks';

const fetchResult = async (
  url: string,
  { method, headers, body }: RequestObject,
): Promise<Response> => {
  
  if (method === RequestType.Get) {
    try {
      return await fetch(url, {
        method: 'GET',
        credentials: "same-origin",
        headers: {
          'Grpc-Metadata-macaroon':'0201036c6e6402f801030a10a8ced166a7c5ba6bf920fb776f86f8701201301a160a0761646472657373120472656164120577726974651a130a04696e666f120472656164120577726974651a170a08696e766f69636573120472656164120577726974651a210a086d616361726f6f6e120867656e6572617465120472656164120577726974651a160a076d657373616765120472656164120577726974651a170a086f6666636861696e120472656164120577726974651a160a076f6e636861696e120472656164120577726974651a140a057065657273120472656164120577726974651a180a067369676e6572120867656e65726174651204726561640000062034b7303ff67a8bd7774f75e577945756a6cfda8a466437fc78f0bbde11cfbc86'},
    
      });
    } catch (e) {
      console.log(e);
    }
  }

  const params = querystring.stringify(body);

  return await fetch(url, {
    method: 'POST',
    headers: {
      ...headers,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params,
  });
};

const objectKeysToCamelCase = (snake_case: Record<string, any>): any => {
  if (
    typeof snake_case !== 'object' ||
    snake_case === null ||
    snake_case === undefined
  ) {
    return snake_case;
  }
  if (Array.isArray(snake_case)) {
    return snake_case.map((value) => objectKeysToCamelCase(value));
  }
  // Object
  return Object.fromEntries(
    Object.entries(snake_case).map(([key, value]) => {
      const camelCaseKey = key.replace(
        /[-|_]([a-z])/g,
        (g) => g[1]?.toUpperCase() || '',
      );
      if (typeof value === 'object') {
        return [camelCaseKey, objectKeysToCamelCase(value)];
      }
      return [camelCaseKey, value];
    }),
  );
};

export const query = async (
  endPoint: string,
  method: RequestType,
  headers: Record<string, string>,
  body: Record<string, any> = {},
) => {
  const requestObj = {
    method,
    headers: headers,
    body,
  };

console.log(requestObj)

  try {
    const url = `http://localhost:3000/proxy${endPoint}`;

    const response = await fetchResult(url, requestObj);

    console.log(response);
    const value = await response.json();
    if (value.success) {
      return value.result;
    }
    throw value;
  } catch (e: any) {
    if (e?.code === 'ECONNABORTED') {
      throw 'timeout';
    }
    throw e;
  }
};

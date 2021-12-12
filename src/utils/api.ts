import { Api, createApiClient } from '@hdwebsoft/intranet-api-sdk';
import config from 'config';
import { SessionStorage } from './SessionStorage';

export const sessionStorage = new SessionStorage();
const apiConfig = {
  baseUrl: config.API_URL,
  authSessionKey: 'AUTH',
  session: sessionStorage,
  enableCache: false,
};

const client = createApiClient(apiConfig);
export const api = new Api(client);

import { Api, createApiClient } from '@hdwebsoft/boilerplate-api-sdk';
import config from 'config';
import { SessionStorage } from './SessionStorage';

export const sessionStorage = new SessionStorage();
const apiConfig = {
  baseUrl: config.API_URL,
  authSessionKey: 'AUTH_SESSION_KEY',
  session: sessionStorage,
  socketUrl: 'http://template-ws.dev.goldfishcode.com',
};

const client = createApiClient(apiConfig);
export const api = new Api(client);

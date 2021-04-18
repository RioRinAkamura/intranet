import { Api, createApiClient } from '@hdwebsoft/boilerplate-api-sdk';
import { SessionStorage } from './SessionStorage';

export const sessionStorage = new SessionStorage();
const config = {
  baseUrl: 'https://api.boilerplate.dev.hdwebsoft.co/v1',
  authSessionKey: 'AUTH_SESSION_KEY',
  session: sessionStorage,
  socketUrl: 'http://template-ws.dev.goldfishcode.com',
};

const client = createApiClient(config);
export const api = new Api(client);

export const config = {
  LOGIN_PATH: process.env.LOGIN_PATH || '/login',
  DASHBOARD_PATH: process.env.DASHBOARD_PATH || '/',
  USERS_PATH: process.env.USERS_PATH || '/users',
  GOOGLE_CLIENT_ID:
    process.env.GOOGLE_CLIENT_ID ||
    '208470488520-a6dhqdj0qv5tjmqrrdhtk7spdprcmg83.apps.googleusercontent.com',
};

export default config;

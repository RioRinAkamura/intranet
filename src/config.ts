export const config = {
  LOGIN_PATH: process.env.LOGIN_PATH || '/login',
  DASHBOARD_PATH: process.env.DASHBOARD_PATH || '/',
  USERS_PATH: process.env.USERS_PATH || '/users',
  CREATE_USER_PATH: process.env.CREATE_USER_PATH || '/create-user',
  GOOGLE_CLIENT_ID:
    process.env.GOOGLE_CLIENT_ID ||
    '416792283902-niarsbm6k01a26ak8o5sc7251j03f0b0.apps.googleusercontent.com',
  FACEBOOK_APP_ID: process.env.FACEBOOK_APP_ID || '507582956840215',
};

export default config;

export const config = {
  API_URL: process.env.REACT_APP_API_URL || 'http://localhost:8000/v1',
  LOGIN_PATH: process.env.LOGIN_PATH || '/login',
  DASHBOARD_PATH: process.env.DASHBOARD_PATH || '/',
  USERS_PATH: process.env.USERS_PATH || '/employees',
  CREATE_USER_PATH: process.env.CREATE_USER_PATH || '/create-user',
  GOOGLE_CLIENT_ID:
    process.env.GOOGLE_CLIENT_ID ||
    '208470488520-tdm6q0i7m1aqve29qkorsija7rhgln48.apps.googleusercontent.com',
  FACEBOOK_APP_ID: process.env.FACEBOOK_APP_ID || '295584335285632',
  DATE_FORMAT: 'YYYY-MM-DD',
};

export default config;

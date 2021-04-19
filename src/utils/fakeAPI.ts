// First we need to import axios.js
import axios from 'axios';
// Next we make an 'instance' of it
const instance = axios.create({
  // .. where we make our configurations
  baseURL: 'https://api.boilerplate.dev.hdwebsoft.co/v1',
});

// Also add/ configure interceptors && all the other cool stuff

instance.interceptors.request.use(
  config => {
    if (!config.headers.Authorization) {
      const auth = localStorage.getItem('AUTH_SESSION_KEY');
      if (auth) {
        const token = JSON.parse(auth).access;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    }

    return config;
  },
  error => {
    console.log(error);
    return Promise.reject(error);
  },
);

instance.interceptors.response.use(
  response => {
    // Edit response config
    return response.data;
  },
  error => {
    console.log(error);
    return Promise.reject(error);
  },
);

export default instance;

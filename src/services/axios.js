import axios from 'axios';

export let BASE_ENDPOINT = '';

// when developing locally, change this value to local
export const APP_ENVIRONMENT = 'local';

if (APP_ENVIRONMENT === 'local') {
  BASE_ENDPOINT = 'http://localhost:5000';
} else if (APP_ENVIRONMENT === 'development') {
  BASE_ENDPOINT = 'https://api.dev.younghub.online';
} else if (APP_ENVIRONMENT === 'staging') {
  BASE_ENDPOINT = 'https://api.stg.<your-backend-domain>';
} else if (APP_ENVIRONMENT === 'production') {
  BASE_ENDPOINT = 'https://api.<your-backend-domain>';
}

const BASE_URL = `${BASE_ENDPOINT}/api/v1`;

const instance = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
  withCredentials: true
});

// Add token from localStorage to all requests
instance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

export default instance;



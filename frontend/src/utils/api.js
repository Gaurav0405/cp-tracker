import axios from 'axios';

const configuredApiUrl = process.env.REACT_APP_API_URL;
const productionApiUrl = configuredApiUrl && /^https?:\/\//i.test(configuredApiUrl)
  ? configuredApiUrl.replace(/\/+$/, '')
  : 'https://cp-tracker-backend-4nrv.onrender.com/api';

const api = axios.create({
  baseURL: window.location.hostname === 'localhost'
    ? 'http://localhost:5000/api'
    : productionApiUrl
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

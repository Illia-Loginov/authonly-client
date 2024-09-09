import { validateApiConfig } from './envValidation';
import axios from 'axios';

const { VITE_SERVER_URL: serverUrl } = validateApiConfig();

export const axiosInstance = axios.create({
  baseURL: serverUrl,
  withCredentials: true
});

const { VITE_SERVER_URL: serverUrl } = import.meta.env;

import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: serverUrl
});

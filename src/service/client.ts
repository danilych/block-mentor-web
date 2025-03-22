import axios from 'axios'
import { getAccessToken } from '@privy-io/react-auth';

const $client = axios.create({baseURL: "https://api-production-a609.up.railway.app/api"})

$client.interceptors.request.use(async (config) => {
  const token = await getAccessToken();
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

export default $client;
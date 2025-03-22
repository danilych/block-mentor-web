import axios from 'axios'
import { API_BASE_URL } from "@/config";
import { getAccessToken } from '@privy-io/react-auth';

const $client = axios.create({baseURL: API_BASE_URL})

$client.interceptors.request.use(async (config) => {
  const token = await getAccessToken();
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

export default $client;
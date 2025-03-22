import {getAccessToken} from "@privy-io/react-auth";
import axios from 'axios'

export const requestInstance = axios.create({
  baseURL: "https://api-production-a609.up.railway.app/api",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${await getAccessToken()}`,
  },
});
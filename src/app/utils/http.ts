import axios from "axios";
import { EXPO_API_URL } from "@env";

const httpInstance = axios.create({
  timeout: 60000,
  baseURL: EXPO_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default httpInstance;

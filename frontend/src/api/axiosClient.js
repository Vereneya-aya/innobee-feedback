import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:5050/api",
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});
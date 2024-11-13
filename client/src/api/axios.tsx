import axios from "axios";
// const BASE_URL = "http://192.168.8.124:5000";
const BASE_URL = process.env.NODE_ENV === "production" ? "https://16.171.34.240/api" : "http://localhost:5000/api";

console.log(BASE_URL)

export default axios.create({
  baseURL: BASE_URL,
});

export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

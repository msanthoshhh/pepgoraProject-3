// lib/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4000', // ✅ Your NestJS API base URL
  withCredentials: true,           // ✅ Important for sending refresh token cookies
});

export default api;

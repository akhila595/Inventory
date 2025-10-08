import axios from "axios";

const API_BASE = "http://localhost:8080/api/auth";

export const registerUser = (data: { email: string; password: string }) =>
  axios.post(`${API_BASE}/register`, data);

export const loginUser = (data: { email: string; password: string }) =>
  axios.post(`${API_BASE}/login`, data);

export const forgotPassword = (data: { email: string }) =>
  axios.post(`${API_BASE}/forgot-password`, data);

import axios from "axios";
//const API_URL = "https://localhost:7054/api";
const API_URL = "http://localhost:5099/api";
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const login = async (loginData) => {
  try {
    const response = await api.post("/account/login", loginData);
    localStorage.setItem("account", JSON.stringify(response.data));
    return response;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Login failed");
  }
};

const register = async (registerData) => {
  try {
    const response = await api.post(`/account/register`, registerData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Registration failed");
  }
};

const verifyEmail = async (email, token) => {
  const response = await api.get(
    `/account/verify-email?email=${email}&token=${token}`
  );
  return response.data;
};

const forgotPassword = async (email) => {
  const response = await api.post("/account/forgot-password", { email });
  return response.data;
};

const resetPassword = async (data) => {
  try {
    const response = await api.post("/account/reset-password", data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Password reset failed");
  }
};

const getApiUrl = () => {
  return API_URL;
};

export default {
  login,
  register,
  verifyEmail,
  forgotPassword,
  resetPassword,
  getApiUrl,
};

import axios from 'axios';

const BASE_URL = 'http://localhost:5099/api';

// Cấu hình axios
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Đăng nhập
export const login = async (data) => {
  const response = await api.post('/account/login', data);
  return response.data;
};

// Đăng ký
export const register = async (userData) => {
  const response = await api.post('/account/register', userData);
  return response.data;
};

// Xác thực email
export const verifyEmail = async (email, token) => {
  const response = await api.get(`/account/verify-email?email=${email}&token=${token}`);
  return response.data;
};

// Đặt lại mật khẩu
export const forgotPassword = async (email) => {
  const response = await api.post('/account/forgot-password', { email });
  return response.data;
};

// Reset mật khẩu
export const resetPassword = async (data) => {
  const response = await api.post('/account/reset-password', data);
  return response.data;
};

export default api;

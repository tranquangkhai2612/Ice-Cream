import axios from "axios";

const API_URL = "http://localhost:5099/api";

const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

const getAllUsers = async () => {
    try {
        const response = await api.get(`${API_URL}/Account/users`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch users');
    }
};
const blockUser = async (userId) => {
    try {
        const response = await api.post('/account/block-user', { userId });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to block user');
    }
};

const getApiUrl = () => {
    return API_URL;
  };
  

export default {
    getAllUsers,
    blockUser,
    getApiUrl
};

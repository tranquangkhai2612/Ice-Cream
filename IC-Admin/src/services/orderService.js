import axios from "axios";

const API_URL = "http://localhost:5099/api/Orders";

export const getOrders = async () => axios.get(API_URL);
export const createOrder = async (order) => axios.post(API_URL, order);
export const updateOrder = async (id, order) =>
  axios.put(`${API_URL}/${id}`, order);
export const deleteOrder = async (id) => axios.delete(`${API_URL}/${id}`);

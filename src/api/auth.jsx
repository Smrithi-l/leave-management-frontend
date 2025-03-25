import axios from "axios";

const API_URL = "https://leave-management-backend-sa2e.onrender.com/api/auth"; 
export const loginUser = async (email, password) => {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    return response.data;
};
export const registerUser = async (name, email, password, role) => {
    const response = await axios.post(`${API_URL}/register`, { name, email, password, role });
    return response.data;
};

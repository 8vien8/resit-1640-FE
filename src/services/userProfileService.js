import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth/me';
const UPDATE_API_URL = 'http://localhost:5000/api/users';

const getMe = async (token) => {
    try {
        const response = await axios.get(API_URL, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching user data:", error.response?.data || error.message);
        throw error;
    }
};

const updateProfile = async (token, userId, formData) => {
    try {
        const response = await axios.put(`${UPDATE_API_URL}/${userId}`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error updating user profile:", error.response?.data || error.message);
        throw error;
    }
};

export default { getMe, updateProfile };

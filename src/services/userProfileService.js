import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth/me'; // Endpoint to get user data
const UPDATE_API_URL = 'http://localhost:5000/api/users'; // Endpoint to update user data

// Function to get user data
const getMe = async (token) => {
    try {
        const response = await axios.get(API_URL, {
            headers: {
                Authorization: `Bearer ${token}`, // Gửi token để xác thực
            },
        });
        return response.data; // Returns user data
    } catch (error) {
        console.error("Error fetching user data:", error.response?.data || error.message);
        throw error; // Re-throw the error for handling in the component
    }
};

// Function to update user profile
const updateProfile = async (token, userId, formData) => {
    try {
        const response = await axios.put(`${UPDATE_API_URL}/${userId}`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data; // Returns the updated user data
    } catch (error) {
        console.error("Error updating user profile:", error.response?.data || error.message);
        throw error; // Re-throw the error for handling in the component
    }
};

export default { getMe, updateProfile };

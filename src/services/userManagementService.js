import axios from 'axios';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext'; // Điều chỉnh đường dẫn nếu cần

const API_URL = 'http://localhost:5000/api/users';

const useUserService = () => {
    const { token } = useContext(UserContext); // Lấy token từ UserContext

    // Hàm để lấy tất cả người dùng
    const getUsers = async () => {
        try {
            const response = await axios.get(API_URL, {
                headers: {
                    Authorization: `Bearer ${token}`, // Gửi token để xác thực
                },
            });
            return response.data; // Trả về dữ liệu người dùng từ API
        } catch (error) {
            console.error('Error fetching users:', error.response?.data || error.message);
            throw error;
        }
    };

    const createUser = async (formData) => {
        try {
            const response = await axios.post(API_URL, formData, {
                headers: {
                    Authorization: `Bearer ${token}`, // Gửi token để xác thực
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data; // Trả về dữ liệu người dùng tạo từ API
        } catch (error) {
            console.error('Error creating user:', error.response?.data || error.message);
            throw error;
        }
    };

    const deleteUser = async (userId) => {
        try {
            const response = await axios.delete(`${API_URL}/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`, // Gửi token để xác thực
                },
            });
            return response.data; // Trả về dữ liệu người dùng xóa từ API
        } catch (error) {
            console.error('Error deleting user:', error.response?.data || error.message);
            throw error;
        }
    }

    const updateUser = async (userId, formData) => {
        try {
            const response = await axios.put(`${API_URL}/${userId}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`, // Gửi token để xác thực
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data; // Trả về dữ liệu người dùng cập nhật từ API
        } catch (error) {
            console.error('Error updating user:', error.response?.data || error.message);
            throw error;
        }
    }

    const getUserById = async (userId) => {
        try {
            const response = await axios.get(`${API_URL}/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching user:', error.response?.data || error.message);
            throw error;
        }
    }

    const getUserByRole = async (roleID) => {
        try {
            const response = await axios.get(`${API_URL}/role/${roleID}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;

        } catch (error) {
            console.error('Error fetching user by role:', error.response?.data || error.message);
            throw error;
        }
    }

    const getUsersByFaculty = async (facultyID) => {
        try {
            const response = await axios.get(`${API_URL}/role/${facultyID}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;

        } catch (error) {
            console.error('Error fetching user by role:', error.response?.data || error.message);
            throw error;
        }
    }
    return {
        getUsers,
        createUser,
        deleteUser,
        updateUser,
        getUserById,
        getUserByRole,
        getUsersByFaculty,
    };
};

export default useUserService;

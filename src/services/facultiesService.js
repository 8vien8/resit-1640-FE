import axios from 'axios';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';

const FACULTIES_URL = 'http://localhost:5000/api/faculties';

const useFacultyService = () => {
    const { token } = useContext(UserContext);

    const getFaculties = async () => {
        try {
            const response = await axios.get(FACULTIES_URL, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching faculties:', error.response?.data || error.message);
            throw error;
        }
    };

    const getFacultyById = async () => {
        try {
            const response = await axios.get(`${FACULTIES_URL}/:id`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching faculty by ID:', error.response?.data || error.message);
            throw error;
        }
    }

    const createFaculty = async (facultyName) => {
        try {
            const response = await axios.post(FACULTIES_URL, { facultyName }, {
                headers: {
                    Authorization: `Bearer ${token}`, // Ensure token is defined
                    'Content-Type': 'application/json',
                },
            });
            return response.data; // Return the created faculty data
        } catch (error) {
            // Log the entire error response to understand the issue
            console.error('Error creating faculty:', error.response || error.message);
            throw error; // Rethrow for handling in the component
        }
    };


    const updateFaculty = async (facultyId, updatedData) => {
        try {
            const response = await axios.put(`${FACULTIES_URL}/${facultyId}`, updatedData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error updating faculty:', error.response?.data || error.message);
            throw error;
        }

    }

    const deleteFaculty = async (facultyId) => {
        try {
            const response = await axios.delete(`${FACULTIES_URL}/${facultyId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error deleting faculty:', error.response?.data || error.message);
            throw error;
        }
    }

    return {
        getFaculties,
        getFacultyById,
        createFaculty,
        updateFaculty,
        deleteFaculty,
    };
};

export default useFacultyService;

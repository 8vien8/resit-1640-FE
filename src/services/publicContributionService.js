import axios from 'axios';

const API_URL = 'http://localhost:5000/api/public-contributions';

export const createPublicContribution = async (data) => {
    try {
        const response = await axios.post(API_URL, data, {
            headers: {
                'Content-Type': 'application/json',
            }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Error creating Public Contribution' };
    }
};

export const getPublicContributions = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Error retrieving Public Contributions' };
    }
};

export const getPublicContributionById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Error retrieving Public Contribution' };
    }
};

export const updatePublicContribution = async (id, data) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, data);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Error updating Public Contribution' };
    }
};

export const deletePublicContribution = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Error deleting Public Contribution' };
    }
};

import axios from "axios";

const API_URL = " http://localhost:5000/api/contributions"

const useContributionService = () => {
    const getContributions = async () => {
        try {
            const response = await axios.get(API_URL);
            return response.data;
        } catch (error) {
            console.error("Error fetching contributions:", error.message);
            return [];
        }
    }

    const getContributionById = async (contributionId) => {
        try {
            const response = await axios.get(`${API_URL}/${contributionId}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching contribution:", error.message);
            return null;
        }
    }

    const createContribution = async (formData) => {
        try {
            const response = await axios.post(API_URL, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            return response.data;
        } catch (error) {
            console.error("Error creating contribution:", error.message);
            throw error;
        }
    }

    const updateContribution = async (contributionId, updatedContribution) => {
        try {
            const response = await axios.put(`${API_URL}/${contributionId}`, updatedContribution, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            return response.data;
        } catch (error) {
            console.error("Error updating contribution:", error.message);
            throw error;
        }
    }

    const deleteContribution = async (contributionId) => {
        try {
            await axios.delete(`${API_URL}/${contributionId}`);
        } catch (error) {
            console.error("Error deleting contribution:", error.message);
            throw error;
        }
    }

    const getContributionByTopicId = async (topicId) => {
        try {
            const response = await axios.get(`${API_URL}/topic/${topicId}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching contributions by topicId:", error.message);
            return [];
        }
    }

    const getContributionForStudent = async (studentId, facultyId, topicId) => {
        try {
            const response = await axios.get(`${API_URL}/${studentId}/${facultyId}/${topicId}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching contributions: ", error);
            return [];
        }
    }

    return {
        getContributions,
        getContributionById,
        createContribution,
        updateContribution,
        deleteContribution,
        getContributionByTopicId,
        getContributionForStudent
    }
}

export default useContributionService;
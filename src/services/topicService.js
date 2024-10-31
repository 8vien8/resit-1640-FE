import axios from "axios";
import { UserContext } from "../context/UserContext";
import { useContext } from "react";

const API_URL = "http://localhost:5000/api/topics"

const useTopicService = () => {

    const { token } = useContext(UserContext);

    const getTopics = async () => {
        try {
            const response = await axios.get(API_URL, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching topics:", error.message);
            return [];
        }
    }

    const getTopicById = async (topicId) => {
        try {
            const response = await axios.get(`${API_URL}/${topicId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching topic:", error.message);
            return null;
        }
    }

    const createTopic = async (topic) => {
        try {
            const response = await axios.post(API_URL, topic, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error("Error creating topic:", error.message);
            throw error;
        }
    }

    const updateTopic = async (topicId, topic) => {
        try {
            const response = await axios.put(`${API_URL}/${topicId}`, topic, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error("Error updating topic:", error.message);
            throw error;
        }
    }

    const deleteTopic = async (topicId) => {
        try {
            await axios.delete(`${API_URL}/${topicId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        } catch (error) {
            console.error("Error deleting topic:", error.message);
        }
    }

    return {
        getTopics,
        getTopicById,
        createTopic,
        updateTopic,
        deleteTopic
    };

}

export default useTopicService;
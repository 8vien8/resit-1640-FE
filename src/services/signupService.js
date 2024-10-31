import axios from "axios";

const API_URL_SIGNUP = 'http://localhost:5000/api/auth/register'

const signup = async (userData) => {
    try {
        const response = await axios.post(API_URL_SIGNUP, userData);
        return response;
    } catch (err) {
        throw new Error(err.response.data.message);
    }
}

export default { signup };
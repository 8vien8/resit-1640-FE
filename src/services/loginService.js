import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth/login';

const login = async (credentials) => {
    const response = await axios.post(API_URL, credentials);
    return response;
};

export default { login };

import axios from "axios";

const API_URL_RESET_PASSWORD = 'http://localhost:5000/api/auth/forgot-password';

const forgotPassword = async (email) => {
    try {
        const response = await axios.post(API_URL_RESET_PASSWORD, { email }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (err) {
        throw err.response ? err.response.data : { message: "An error occurred." };
    }
};

export default { forgotPassword };

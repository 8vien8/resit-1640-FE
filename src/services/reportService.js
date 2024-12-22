import axios from 'axios';

const API_URL = 'http://localhost:5000/api/statistics';

export const getReportStatistics = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data.report;
    } catch (error) {
        throw new Error(error.message);
    }
};

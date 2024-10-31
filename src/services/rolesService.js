import axios from 'axios';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';

const ROLES_URL = 'http://localhost:5000/api/roles';

const useRoleService = () => {
    const { token } = useContext(UserContext);

    const getRoles = async () => {
        try {
            const response = await axios.get(ROLES_URL, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            console.error(error);
        }
        return null;
    }

    return {
        getRoles,

    };
};

export default useRoleService;

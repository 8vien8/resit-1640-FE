import { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);

    useEffect(() => {
        const savedUser = JSON.parse(sessionStorage.getItem('user'));
        const savedToken = sessionStorage.getItem('token');

        if (savedUser && savedToken) {
            setUser(savedUser);
            setToken(savedToken);
        }
    }, []);

    const login = (userData, token) => {
        setUser(userData);
        setToken(token);
        sessionStorage.setItem('user', JSON.stringify(userData));
        sessionStorage.setItem('token', token);
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('token');
    };

    return (
        <UserContext.Provider value={{ user, token, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};

UserProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

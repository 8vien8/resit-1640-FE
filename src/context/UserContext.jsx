import { createContext, useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { jwtDecode } from 'jwt-decode';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);

    const logout = useCallback(() => {
        setUser(null);
        setToken(null);
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('token');
    }, []);

    const setLogoutTimer = useCallback((timeout) => {
        setTimeout(() => {
            logout();
        }, timeout);
    }, [logout]);

    useEffect(() => {
        const savedUser = JSON.parse(sessionStorage.getItem('user'));
        const savedToken = sessionStorage.getItem('token');

        if (savedUser && savedToken) {
            const decodedToken = jwtDecode(savedToken);
            const currentTime = Date.now() / 1000;

            if (decodedToken.exp > currentTime) {
                setUser(savedUser);
                setToken(savedToken);

                // Set auto logout timer
                const timeout = (decodedToken.exp - currentTime) * 1000; // Convert to milliseconds
                setLogoutTimer(timeout);
            } else {
                // Token expired, logout
                logout();
            }
        }
    }, [setLogoutTimer, logout]);

    const login = (userData, token) => {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decodedToken.exp > currentTime) {
            setUser(userData);
            setToken(token);
            sessionStorage.setItem('user', JSON.stringify(userData));
            sessionStorage.setItem('token', token);

            // Set auto logout timer
            const timeout = (decodedToken.exp - currentTime) * 1000; // Convert to milliseconds
            setLogoutTimer(timeout);
        } else {
            console.error('Token is already expired');
        }
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

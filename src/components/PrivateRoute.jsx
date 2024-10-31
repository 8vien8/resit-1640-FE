import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import PropTypes from 'prop-types';

const PrivateRoute = ({ allowedRoles }) => {
    const { user } = useContext(UserContext);

    if (!user) {
        return <Navigate to="/login" />;
    }

    if (!allowedRoles.includes(user.roleID)) {
        return <Navigate to="/unauthorized" />;
    }

    return <Outlet />;
};

PrivateRoute.propTypes = {
    allowedRoles: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default PrivateRoute;

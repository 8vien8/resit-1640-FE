import React, { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import { Navigate } from "react-router-dom";
import { Button, Box, IconButton, Tooltip } from "@mui/material";
import { Logout } from "@mui/icons-material";
import PropTypes from "prop-types";

const LogoutButton = ({ isMobile, isCollapsed }) => {
    const { logout, user } = useContext(UserContext);
    const [redirect, setRedirect] = React.useState(false);

    const handleLogout = () => {
        logout();
        setRedirect(true);
    };

    if (redirect) {
        return <Navigate to="/login" />;
    }

    return (
        <Box sx={{ display: "flex", justifyContent: "center", m: 2 }}>
            <Tooltip title="Logout" placement="right">
                {user && (
                    // Conditionally render Button or IconButton based on isMobile or isCollapsed
                    isMobile || isCollapsed ? (
                        <IconButton color="primary" onClick={handleLogout}>
                            <Logout fontSize="large" />
                        </IconButton>
                    ) : (
                        <Button variant="contained" color="primary" onClick={handleLogout}>
                            Logout
                        </Button>
                    )
                )}
            </Tooltip>
        </Box>
    );
};

LogoutButton.propTypes = {
    isMobile: PropTypes.bool.isRequired,
    isCollapsed: PropTypes.bool.isRequired
};

export default LogoutButton;

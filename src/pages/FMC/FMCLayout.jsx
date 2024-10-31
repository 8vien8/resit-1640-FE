import { Box, Toolbar } from '@mui/material';
import { Outlet } from 'react-router-dom';
import FMCNavbar from '../Navbar/FMCNavbar';

const FMCLayout = () => {
    return (
        <Box sx={{ display: 'flex' }}>
            <FMCNavbar />
            <Box
                component="main"
                sx={{ flexGrow: 1, backgroundColor: 'background.default', p: 3 }}
            >
                <Toolbar />

                <Outlet />
            </Box>
        </Box>
    );
};

export default FMCLayout;

import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import UMMNavbar from '../Navbar/UMMNavbar';

const UMMLayout = () => {
    return (
        <Box sx={{ display: 'flex' }}>
            <UMMNavbar />
            <Box
                component="main"
                sx={{ flexGrow: 1, backgroundColor: 'background.default', p: 3 }}
            >

                <Outlet />
            </Box>
        </Box>
    );
};

export default UMMLayout;

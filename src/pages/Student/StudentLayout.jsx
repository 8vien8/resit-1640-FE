import { Box, Toolbar } from '@mui/material';
import { Outlet } from 'react-router-dom';
import StudentNavbar from '../Navbar/StudentNavbar';

const StudentLayout = () => {
    return (
        <Box sx={{ display: 'flex' }}>
            <StudentNavbar />
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

export default StudentLayout;

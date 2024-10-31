import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import AdminNavbar from '../Navbar/AdminNavbar';

const AdminLayout = () => {
    return (
        <Box sx={{ display: 'flex' }}>
            <AdminNavbar />
            <Box
                component="main"
                sx={{ flexGrow: 1, backgroundColor: 'background.default', p: 3 }}
            >

                <Outlet />
            </Box>
        </Box>
    );
};

export default AdminLayout;

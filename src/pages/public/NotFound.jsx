import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
const NotFound = () => {
    const navigate = useNavigate();
    return (
        <Box sx={{ textAlign: 'center', mt: 5 }}>
            <Typography variant="h4" gutterBottom>
                404 - Not Found
            </Typography>
            <Typography variant="body1">
                The page you are looking for does not exist.
            </Typography>
            <Button
                sx={{ mt: 3 }}
                variant='outlined'
                onClick={() => navigate('/login')}
            >
                Back to home
            </Button>
        </Box >
    );
};

export default NotFound;

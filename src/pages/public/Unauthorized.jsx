import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
const Unauthorized = () => {
    const navigate = useNavigate();
    return (
        <Box sx={{ textAlign: 'center', mt: 5 }}>
            <Typography variant="h4" gutterBottom>
                403 - Unauthorized
            </Typography>
            <Typography variant="body1">
                You do not have permission to access this page.
            </Typography>
            <Button
                sx={{ mt: 3 }}
                variant='outlined'
                onClick={() => navigate('/login')}
            />
        </Box>
    );
};

export default Unauthorized;

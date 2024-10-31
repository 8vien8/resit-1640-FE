import { Box, Typography } from '@mui/material';

const Unauthorized = () => {
    return (
        <Box sx={{ textAlign: 'center', mt: 5 }}>
            <Typography variant="h4" gutterBottom>
                403 - Unauthorized
            </Typography>
            <Typography variant="body1">
                You do not have permission to access this page.
            </Typography>
        </Box>
    );
};

export default Unauthorized;

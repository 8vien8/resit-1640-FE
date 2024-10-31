import { Box, Typography } from '@mui/material';

const NotFound = () => {
    return (
        <Box sx={{ textAlign: 'center', mt: 5 }}>
            <Typography variant="h4" gutterBottom>
                404 - Not Found
            </Typography>
            <Typography variant="body1">
                The page you are looking for does not exist.
            </Typography>
        </Box>
    );
};

export default NotFound;

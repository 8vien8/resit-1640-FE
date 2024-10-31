
import { Box, Typography, Button, Paper } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useNavigate } from 'react-router-dom';
import Circle from './circle';

const ResetPasswordSuccess = () => {
    const navigate = useNavigate();

    const handleLoginRedirect = () => {
        navigate('/login');
    };

    return (
        <Box
            sx={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                padding: '20px',
                backgroundColor: '#f0f0f0',
                overflow: 'hidden'
            }}
        >
            <Circle size="200px" color="#4CAF50" position={{ top: '-10%', left: '-20%' }} />
            <Circle size="300px" color="#FFA726" position={{ bottom: '-30%', right: '-20%' }} />
            <Circle size="250px" color="#2196F3" position={{ top: '30%', right: '-10%' }} />
            <Circle size="180px" color="#F44336" position={{ top: '60%', left: '10%' }} />
            <Circle size="220px" color="#9C27B0" position={{ bottom: '20%', left: '-30%' }} />
            <Circle size="120px" color="#FFC107" position={{ top: '50%', right: '5%' }} />
            <Circle size="160px" color="#3F51B5" position={{ bottom: '15%', right: '30%' }} />
            <Circle size="90px" color="#E91E63" position={{ top: '15%', left: '35%' }} />
            <Circle size="130px" color="#CDDC39" position={{ top: '75%', left: '40%' }} />
            <Circle size="150px" color="#FF9800" position={{ top: '45%', left: '60%' }} />

            <Paper
                elevation={3}
                sx={{
                    padding: '40px',
                    borderRadius: '8px',
                    textAlign: 'center',
                    backgroundColor: 'white',
                    boxShadow: '0px 3px 20px rgba(0, 0, 0, 0.1)',
                    zIndex: 1,
                }}
            >
                <CheckCircleIcon
                    sx={{
                        fontSize: '80px',
                        color: '#4CAF50',
                        marginBottom: '20px'
                    }}
                />
                <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Password Reset Successfully!
                </Typography>
                <Typography variant="body1" color="text.secondary" gutterBottom>
                    Your password has been reset successfully. Check your email for new password.
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleLoginRedirect}
                    sx={{
                        marginTop: '20px',
                        padding: '10px 20px',
                        borderRadius: '20px',
                        fontWeight: 'bold'
                    }}
                >
                    Go to Login
                </Button>
            </Paper>
        </Box>
    );
};

export default ResetPasswordSuccess;

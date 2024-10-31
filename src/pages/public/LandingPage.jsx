import { useState } from 'react';
import { Container, Box, Typography, Button, Grid } from '@mui/material';
import { Navigate } from 'react-router-dom';

const LandingPage = () => {
    const [redirect, setRedirect] = useState(false);

    const openLoginForm = () => {
        setRedirect(true);
    };

    if (redirect) {
        return <Navigate to="/login" />;
    }

    return (
        <Container
            maxWidth={false}
            sx={{
                px: { xs: 2, md: 5 },
                maxWidth: '1600px',
            }}
        >
            <Box
                sx={{
                    height: '80vh',
                    backgroundImage: 'url(https://ap.greenwich.edu.vn/images/bg.jpg)',
                    backgroundSize: 'cover',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: '#fff',
                    flexDirection: 'column',
                }}
            >
                <Typography variant="h2" align="center" color='#1976e2' sx={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.4)' }}>
                    Welcome to University of Green
                </Typography>
                <Button variant="contained" onClick={openLoginForm} sx={{ boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.6)' }}>
                    Start Your Journey
                </Button>
            </Box>

            <Box sx={{ py: 6 }}>
                <Typography variant="h4" align="center" gutterBottom>
                    Why Choose Us?
                </Typography>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={4}>
                        <Typography variant="h6" align="center">World-Class Education</Typography>
                        <Typography align="center">We offer top-tier programs in various fields.</Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Typography variant="h6" align="center">Research Opportunities</Typography>
                        <Typography align="center">Engage in cutting-edge research and innovation.</Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Typography variant="h6" align="center">Global Community</Typography>
                        <Typography align="center">Join a vibrant, diverse, and supportive community.</Typography>
                    </Grid>
                </Grid>
            </Box>

            <Box sx={{ py: 6, backgroundColor: '#f5f5f5' }}>
                <Typography variant="h4" align="center" gutterBottom>
                    What Our Students Say
                </Typography>
                <Grid container spacing={4} justifyContent="center">
                    <Grid item xs={12} md={3}>
                        <Typography align="center"> Great experience! - Student A</Typography>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Typography align="center"> Amazing programs! - Student B</Typography>
                    </Grid>
                </Grid>
            </Box>

            <Box sx={{ py: 4, textAlign: 'center' }}>
                <Typography variant="body2">© [Year] [University Name]. All Rights Reserved.</Typography>
                <Typography variant="body2">
                    <a href="/privacy-policy">Privacy Policy</a> | <a href="/contact">Contact Us</a>
                </Typography>
            </Box>
        </Container>
    );
};

export default LandingPage;

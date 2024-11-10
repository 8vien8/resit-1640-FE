import { useState } from "react";
import { TextField, Button, Container, Box, Typography, Alert, Stack } from "@mui/material";
import signupService from "../../services/signupService";
import { Link, useNavigate } from "react-router-dom";

const SignUpPage = () => {
    const [userData, setUserData] = useState({ email: "", username: "" });
    const [isSignedUp, setIsSignedUp] = useState(false); 
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");

    const navigate = useNavigate();
    const handleInputChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    const handleSignUp = async (event) => {
        event.preventDefault();
        setError(null);

        try {
            await signupService.signup(userData);
            setSuccessMessage("Registration successful. Please check your email for further instructions.");
            setIsSignedUp(true);
        } catch (error) {
            setError("Signup failed, please ensure all details are correct or email might already exist.");
            console.log(error);
        }
    };

    const handleConfirm = () => {
        navigate("/login");
    };

    return (
        <Container maxWidth={false}
            sx={{
                height: "100dvh",
                maxWidth: '1600px',
                display: "flex",
                alignItems: "center ",
                justifyContent: "center",
                backgroundImage: 'url(https://ap.greenwich.edu.vn/images/bg.jpg)',
                backgroundSize: 'cover',
            }}>
            <Box
                sx={{
                    py: 6,
                    px: 2,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    border: "0.08rem solid gray",
                    borderRadius: 2,
                    boxShadow: 3,
                    background: 'rgba(255 255 255 / 0.6)',
                }}
            >
                <Box
                    sx={{
                        py: 7,
                        px: 2,
                        backgroundImage: 'url(https://ap.greenwich.edu.vn/Logo15.png)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        width: '100%',
                        height: '100%',
                    }}
                />
                <Typography component="h1" variant="h4">
                    Sign Up
                </Typography>

                {error && <Alert severity="error">{error}</Alert>}
                {successMessage && <Alert severity="success">{successMessage}</Alert>}

                <Box component="form" onSubmit={handleSignUp} sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="User Name"
                        name="username"
                        autoComplete="username"
                        value={userData.username}
                        onChange={handleInputChange}
                    />
                    <TextField
                        type="email"
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        value={userData.email}
                        onChange={handleInputChange}
                    />

                    {!isSignedUp && (
                        <Box sx={{ display: "flex", justifyContent: "center" }}>
                            <Button type="submit" variant="outlined" sx={{ mt: 2, mb: 2, px: 4, boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.6)' }}>
                                Sign Up
                            </Button>
                        </Box>
                    )}

                    {isSignedUp && (
                        <Box sx={{ display: "flex", justifyContent: "center" }}>
                            <Button
                                onClick={handleConfirm}
                                variant="contained"
                                sx={{ mt: 2, mb: 2, px: 4 }}
                            >
                                Confirm
                            </Button>
                        </Box>
                    )}

                    <Stack direction="row" justifyContent="center" sx={{ width: "100%" }}>
                        <Link to="/login" style={{ textDecoration: "none" }}>
                            <Typography variant="body2" color="primary">
                                Already have an account? Login
                            </Typography>
                        </Link>
                    </Stack>
                </Box>
            </Box>
        </Container>
    );
};

export default SignUpPage;

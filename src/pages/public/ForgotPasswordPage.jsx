import { useState } from "react";
import { TextField, Button, Container, Box, Typography, Alert, Stack } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { Link } from "react-router-dom";
import forgotPasswordService from "../../services/forgotPasswordService";

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        setEmail(e.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);
        setMessage(null);
        setLoading(true);

        try {
            const response = await forgotPasswordService.forgotPassword(email);
            setMessage(response.message);
            setEmail("");
        } catch (error) {
            const errorMessage = error.message || "Error sending password reset link.";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth={false}
            sx={{
                height: "100vh",
                maxWidth: '1600px',
                display: "flex",
                alignItems: "center",
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
                    background: 'rgba(255, 255, 255, 0.8)',
                }}
            >
                <Box
                    sx={{
                        py: 2,
                        px: 2,
                        backgroundImage: 'url(https://ap.greenwich.edu.vn/Logo15.png)',
                        backgroundSize: 'contain',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        width: '100%',
                        height: '80px'
                    }}
                />
                <Typography component="h1" variant="h5">
                    Forgot Password
                </Typography>

                {error && <Alert severity="error">{error}</Alert>}
                {message && <Alert severity="success">{message}</Alert>}

                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2, width: "100%" }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        type="email"
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        value={email}
                        onChange={handleInputChange}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        sx={{ mt: 3, mb: 2 }}
                        disabled={loading}
                    >
                        {loading ? "Sending..." : "Send Reset Link"}
                    </Button>

                    <Stack direction="row" sx={{ width: "100%", justifyContent: "center" }}>
                        <Link to="/login" style={{ textDecoration: "none" }}>
                            <Typography variant="body1" color="primary" sx={{ display: "flex", alignItems: "center" }}>
                                <ArrowBack /> {" Back to Login"}
                            </Typography>
                        </Link>
                    </Stack>
                </Box>
            </Box>
        </Container>
    );
};

export default ForgotPasswordPage;

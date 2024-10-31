import { useState, useContext } from "react";
import { UserContext } from "../../context/UserContext";
import { Navigate, Link } from "react-router-dom";
import loginService from "../../services/loginService";
import { TextField, Button, Container, Box, Typography, Alert, Stack, CircularProgress } from "@mui/material";

const LoginPage = () => {
    const { user, login } = useContext(UserContext);
    const [credentials, setCredentials] = useState({ email: "", password: "" });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false); // Loading state for login process

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCredentials({ ...credentials, [name]: value });
    };

    const handleLogin = async (event) => {
        event.preventDefault();
        setError(null);
        setLoading(true); // Start loading

        try {
            const response = await loginService.login(credentials);
            const { token, user } = response.data;

            if (token && user) {
                login(user, token);
            } else {
                setError("Invalid login attempt.");
            }
        } catch (error) {
            setError("Invalid email or password.");
            console.error("Login error:", error);
        } finally {
            setLoading(false); // Stop loading
        }
    };

    if (user) {
        return <Navigate to="/redirect" />;
    }

    return (
        <Container
            maxWidth={false}
            sx={{
                height: "100vh",
                maxWidth: '1600px',
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundImage: 'url(https://ap.greenwich.edu.vn/images/bg.jpg)',
                backgroundSize: 'cover',
            }}
        >
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
                    Login
                </Typography>

                {error && <Alert severity="error">{error}</Alert>}

                <Box
                    component="form"
                    onSubmit={handleLogin}
                    noValidate
                    sx={{ mt: 1 }}
                >
                    <TextField
                        type="email"
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        value={credentials.email}
                        onChange={handleInputChange}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={credentials.password}
                        onChange={handleInputChange}
                    />

                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Button
                            type="submit"
                            variant="contained"
                            sx={{ mt: 2, mb: 2, px: 4, boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.6)' }}
                            disabled={loading} // Disable button while loading
                        >
                            {loading ? <CircularProgress size={24} /> : "Login"}
                        </Button>
                    </Box>

                    <Stack direction="row" justifyContent="space-between" sx={{ width: '100%' }}>
                        <Link to="/reset-password" style={{ textDecoration: "none" }}>
                            <Typography variant="body2" color="primary">
                                {"Forgot Password?"}
                            </Typography>
                        </Link>
                        <Link to="/signup" style={{ textDecoration: "none" }}>
                            <Typography variant="body2" color="primary">
                                {"Don't have an account? Sign Up"}
                            </Typography>
                        </Link>
                    </Stack>
                </Box>
            </Box>
        </Container>
    );
};

export default LoginPage;

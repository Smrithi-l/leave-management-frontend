import React, { useState } from "react";
import { TextField, Button, Container, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/auth";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await loginUser(email, password);
            localStorage.setItem("token", response.token);
            localStorage.setItem("role", response.role);
            window.location.href = response.role === "admin" ? "/admin-dashboard" : "/employee-dashboard";
        } catch (error) {
            setError("Invalid email or password");
        }
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            }}
        >
            <Container maxWidth="xs">
                <Box
                    sx={{
                        p: 4,
                        backgroundColor: "white",
                        boxShadow: 5,
                        borderRadius: 3,
                        textAlign: "center",
                        position: "relative",
                    }}
                >
                    <Typography
                        variant="h4"
                        fontWeight="bold"
                        color="primary"
                        gutterBottom
                    >
                        Welcome Back
                    </Typography>
                    <Typography color="textSecondary" mb={2}>
                        Login to your account
                    </Typography>
                    {error && (
                        <Typography color="error" sx={{ mb: 2 }}>
                            {error}
                        </Typography>
                    )}
                    <TextField
                        fullWidth
                        label="Email"
                        margin="normal"
                        variant="outlined"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        sx={{ bgcolor: "#f7f7f7", borderRadius: 1 }}
                    />
                    <TextField
                        fullWidth
                        label="Password"
                        type="password"
                        margin="normal"
                        variant="outlined"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        sx={{ bgcolor: "#f7f7f7", borderRadius: 1 }}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{
                            mt: 2,
                            p: 1.5,
                            fontSize: "1rem",
                            fontWeight: "bold",
                            borderRadius: 2,
                            textTransform: "none",
                        }}
                        onClick={handleLogin}
                    >
                        Login
                    </Button>
                    <Typography mt={2} fontSize="0.9rem">
                        Don't have an account?{" "}
                        <span
                            style={{
                                color: "#667eea",
                                fontWeight: "bold",
                                cursor: "pointer",
                            }}
                            onClick={() => navigate("/signup")}
                        >
                            Sign Up
                        </span>
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default Login;

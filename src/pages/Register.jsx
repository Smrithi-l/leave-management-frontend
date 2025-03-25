import React, { useState } from "react";
import { TextField, Button, Container, Typography, Box, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/auth";

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("employee");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleRegister = async () => {
        try {
            await registerUser(name, email, password, role);
            navigate("/");
        } catch (error) {
            setError("Registration failed. Try again.");
        }
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 10, p: 3, boxShadow: 3, borderRadius: 2 }}>
                <Typography variant="h4" align="center" gutterBottom>Register</Typography>
                {error && <Typography color="error" align="center">{error}</Typography>}
                <TextField fullWidth label="Name" margin="normal" value={name} onChange={(e) => setName(e.target.value)} />
                <TextField fullWidth label="Email" margin="normal" value={email} onChange={(e) => setEmail(e.target.value)} />
                <TextField fullWidth label="Password" type="password" margin="normal" value={password} onChange={(e) => setPassword(e.target.value)} />
                <TextField
                    select
                    fullWidth
                    label="Role"
                    margin="normal"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                >
                    <MenuItem value="employee">Employee</MenuItem>
                    <MenuItem value="admin">Admin</MenuItem>
                </TextField>
                <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} onClick={handleRegister}>Register</Button>
                <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                    Already have an account? <Button onClick={() => navigate("/")}>Login</Button>
                </Typography>
            </Box>
        </Container>
    );
};

export default Register;

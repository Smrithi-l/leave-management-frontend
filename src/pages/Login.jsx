// src/pages/Login.js
"use client";

import React, { useState } from "react";
import {
  Box,
  Card,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  Link,
  Grid,
  FormControlLabel,
  Checkbox,
  CircularProgress,
} from "@mui/material";
import { Visibility, VisibilityOff, Email, Lock } from "@mui/icons-material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { loginUser } from "../api/auth"; // your API login function
import logo from "../assets/logo.jpg";
import illustration from "../assets/illustration.png";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
  } = useForm({
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await loginUser(data.email, data.password);
      localStorage.setItem("token", response.token);
      localStorage.setItem("role", response.role);

      if (rememberMe) {
        localStorage.setItem("rememberedEmail", data.email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      setTimeout(() => {
        window.location.href = response.role === "admin" ? "/admin-dashboard" : "/employee-dashboard"
      }, 500)
    } catch (error) {
      setError("Invalid email or password. Please try again.")
      setIsLoading(false)
    }
  };

  return (
    <Box
      sx={{
        minHeight: "80vh",
        height: "100vh",     
        overflow: "hidden",  
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        position: "relative",
      }}
    >
    
      {/* Decorative background elements */}
      <Box
        component={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ duration: 1, delay: 1 }}
        sx={{
          position: "absolute",
          top: "10%",
          left: "5%",
          width: 150,
          height: 150,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(41,182,246,0.2) 0%, rgba(2,136,209,0) 70%)",
          zIndex: 0,
        }}
      />
      <Box
        component={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ duration: 1, delay: 1.2 }}
        sx={{
          position: "absolute",
          bottom: "15%",
          right: "10%",
          width: 200,
          height: 200,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(1,87,155,0.2) 0%, rgba(2,136,209,0) 70%)",
          zIndex: 0,
        }}
      />

      {/* Main Card */}
      <Card
        component={motion.div}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          width: { xs: "100%", sm: "90%", md: "70%" },
          maxWidth: 1000,
          borderRadius: 4,
          boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
          overflow: "hidden",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Left Section - Form */}
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            p: { xs: 4, sm: 6 },
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Box textAlign="center" mb={2}>
            <img src={logo} alt="Logo" width={170} />
            <Typography variant="h5" fontWeight={700} mt={0} sx={{ fontSize: "30px" }}>
              Welcome Back To ZenPay
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage your leaves, approvals, and salary efficiently.
            </Typography>
          </Box>

          <Typography
            variant="h6"
            fontWeight={600}
            textAlign="center"
            sx={{ color: "#2563eb", fontSize: "21px" }}
            mb={-1}
          >
            Login
          </Typography>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Typography
                color="error"
                sx={{
                  mb: 3,
                  p: 1.5,
                  bgcolor: "rgba(255, 0, 0, 0.05)",
                  borderRadius: 2,
                  textAlign: "center",
                  border: "1px solid rgba(255, 0, 0, 0.1)",
                }}
              >
                {error}
              </Typography>
            </motion.div>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Email */}
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Email"
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  required
                  type="email"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />

            {/* Password */}
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock color="primary" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />

            {/* Remember Me */}
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mt={1}
              mb={2}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    sx={{
                      color: "#2563eb",
                      "&.Mui-checked": { color: "#2563eb" },
                    }}
                  />
                }
                label={<Typography variant="body2">Remember me</Typography>}
              />
            </Box>

            {/* Submit */}
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={isLoading}
              sx={{
                mt: 2,
                py: 1.5,
                fontSize: "1rem",
                textTransform: "none",
                borderRadius: 2,
                bgcolor: "#2563eb",
                "&:hover": { bgcolor: "#1e40af" },
              }}
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Login"
              )}
            </Button>
          </form>

          <Box
            mt={3}
            display="flex"
            justifyContent="center"
            gap={2}
            sx={{ fontSize: "0.85rem" }}
          >
            <Link href="#" underline="hover">
              Privacy Policy
            </Link>
            <Link href="#" underline="hover">
              Terms and Conditions
            </Link>
          </Box>
        </Grid>

        {/* Right Section - Illustration */}
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            bgcolor: "#ffffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "Flex-start",
            p: { xs: 1, sm: 0 },
          }}
        >
          <Box
            component="img"
            src={illustration}
            alt="Illustration"
            sx={{
              width: "100%",
              maxWidth: 400,
              height: "auto",
              objectFit: "contain",
              borderRadius: 2,
              ml: -4,
            }}
          />
        </Grid>
      </Card>
    </Box>
  );
}
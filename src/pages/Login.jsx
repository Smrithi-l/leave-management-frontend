"use client"

import { useState } from "react"
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  InputAdornment,
  IconButton,
  FormControlLabel,
  Checkbox,
  CircularProgress,
  Paper,
} from "@mui/material"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Visibility, VisibilityOff, Email, Lock } from "@mui/icons-material"
import { loginUser } from "../api/auth"
import { useForm, Controller } from "react-hook-form"

const MotionContainer = motion(Container)
const MotionPaper = motion(Paper)
const MotionTypography = motion(Typography)
const MotionButton = motion(Button)

const Login = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [rememberMe, setRememberMe] = useState(false)
  const navigate = useNavigate()

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (data) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await loginUser(data.email, data.password)
      localStorage.setItem("token", response.token)
      localStorage.setItem("role", response.role)

      if (rememberMe) {
        localStorage.setItem("rememberedEmail", data.email)
      } else {
        localStorage.removeItem("rememberedEmail")
      }

      // Use framer motion's AnimatePresence for a smooth transition before redirect
      setTimeout(() => {
        window.location.href = response.role === "admin" ? "/admin-dashboard" : "/employee-dashboard"
      }, 500)
    } catch (error) {
      setError("Invalid email or password. Please try again.")
      setIsLoading(false)
    }
  }

  const handleTogglePassword = () => {
    setShowPassword(!showPassword)
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: 2,
      }}
    >
      <MotionContainer
        maxWidth="xs"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <MotionPaper
          elevation={10}
          sx={{
            p: 4,
            borderRadius: 4,
            overflow: "hidden",
            position: "relative",
          }}
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <MotionTypography
            variant="h4"
            fontWeight="bold"
            color="primary"
            gutterBottom
            textAlign="center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Welcome Back
          </MotionTypography>

          <MotionTypography
            color="textSecondary"
            mb={3}
            textAlign="center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Login to your account
          </MotionTypography>

          {error && (
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
              <Typography
                color="error"
                sx={{
                  mb: 2,
                  p: 1,
                  bgcolor: "rgba(255, 0, 0, 0.05)",
                  borderRadius: 1,
                  textAlign: "center",
                }}
              >
                {error}
              </Typography>
            </motion.div>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Controller
                name="email"
                control={control}
                rules={{
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Email"
                    margin="normal"
                    variant="outlined"
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email color="primary" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      bgcolor: "rgba(247, 247, 247, 0.5)",
                      borderRadius: 1,
                      "& .MuiOutlinedInput-root": {
                        "&:hover fieldset": {
                          borderColor: "primary.main",
                        },
                      },
                    }}
                  />
                )}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Controller
                name="password"
                control={control}
                rules={{
                  required: "Password is required",
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    margin="normal"
                    variant="outlined"
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock color="primary" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton aria-label="toggle password visibility" onClick={handleTogglePassword} edge="end">
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      bgcolor: "rgba(247, 247, 247, 0.5)",
                      borderRadius: 1,
                      "& .MuiOutlinedInput-root": {
                        "&:hover fieldset": {
                          borderColor: "primary.main",
                        },
                      },
                    }}
                  />
                )}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 1, mb: 2 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      color="primary"
                      size="small"
                    />
                  }
                  label={<Typography variant="body2">Remember me</Typography>}
                />
                <Typography
                  variant="body2"
                  color="primary"
                  sx={{
                    cursor: "pointer",
                    fontWeight: "medium",
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                  onClick={() => navigate("/forgot-password")}
                >
                  Forgot password?
                </Typography>
              </Box>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <MotionButton
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                sx={{
                  mt: 2,
                  p: 1.5,
                  fontSize: "1rem",
                  fontWeight: "bold",
                  borderRadius: 2,
                  textTransform: "none",
                  boxShadow: 3,
                }}
              >
                {isLoading ? <CircularProgress size={24} color="inherit" /> : "Login"}
              </MotionButton>
            </motion.div>
          </form>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.9 }}>
            <Typography mt={3} fontSize="0.9rem" textAlign="center">
              Don't have an account?{" "}
              <motion.span
                style={{
                  color: "#667eea",
                  fontWeight: "bold",
                  cursor: "pointer",
                  display: "inline-block",
                }}
                whileHover={{ scale: 1.05 }}
                onClick={() => navigate("/signup")}
              >
                Sign Up
              </motion.span>
            </Typography>
          </motion.div>

          <Box
            component={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
            sx={{
              display: "flex",
              justifyContent: "center",
              mt: 3,
              gap: 2,
            }}
          >
            <Typography variant="caption" color="text.secondary">
              © {new Date().getFullYear()} Company Name
            </Typography>
            <Typography variant="caption" color="primary" sx={{ cursor: "pointer" }}>
              Privacy Policy
            </Typography>
            <Typography variant="caption" color="primary" sx={{ cursor: "pointer" }}>
              Terms of Service
            </Typography>
          </Box>
        </MotionPaper>
      </MotionContainer>
    </Box>
  )
}

export default Login
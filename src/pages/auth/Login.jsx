import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  Link,
  Paper,
  InputAdornment,
  IconButton,
  useTheme,
  alpha,
  Container,
  Grid,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { styled } from '@mui/material/styles';
import API from '../../API';
import bg from '../../assets/bg-1.jpg';
import {
  Email as EmailIcon,
  ArrowBack as ArrowBackIcon,
  Send as SendIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from '@mui/icons-material';
import axios from 'axios';

const StyledContainer = styled(Container)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  padding: 0,
  position: 'relative',
  overflow: 'hidden',
  background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 70%)',
    zIndex: 0,
  },
}));

const LeftSection = styled(Box)(({ theme }) => ({
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  color: 'white',
  position: 'relative',
  overflow: 'hidden',
  padding: theme.spacing(8),
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `url(${bg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    opacity: 1.0,
    zIndex: 0,
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(45deg, rgba(25, 118, 210, 0.9), rgba(33, 150, 243, 0.9))',
    opacity: 0.5,
    zIndex: 1,
  },
}));

const FloatingStars = styled(Box)(({ theme }) => ({
  position: 'absolute',
  width: '100%',
  height: '100%',
  overflow: 'hidden',
  zIndex: 0,
}));

const Star = styled(motion.div)(({ theme }) => ({
  position: 'absolute',
  width: '2px',
  height: '2px',
  background: 'white',
  borderRadius: '50%',
}));

const RightSection = styled(Box)(({ theme }) => ({
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(8),
  background: 'linear-gradient(145deg, #ffffff, #f5f5f5)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0) 70%)',
    zIndex: 0,
  },
}));

const StyledForm = styled('form')(({ theme }) => ({
  width: '100%',
  maxWidth: '400px',
  margin: '0 auto',
  position: 'relative',
  zIndex: 2,
}));

const StyledButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(3, 0, 2),
  padding: theme.spacing(1.5),
  background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
  borderRadius: '12px',
  transition: 'all 0.3s ease',
  position: 'relative',
  overflow: 'hidden',
  minHeight: '48px',
  boxShadow: '0 4px 15px rgba(33, 150, 243, 0.3)',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
    transform: 'translateX(-100%)',
    transition: 'transform 0.6s ease',
  },
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 20px rgba(33, 150, 243, 0.4)',
    '&::before': {
      transform: 'translateX(100%)',
    },
  },
}));

const Login = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const apiUrl = `${API}/auth/login`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(apiUrl, formData);
      // const response = await API.post
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', response.data.user.role);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };


  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <StyledContainer maxWidth={false} disableGutters>
      <FloatingStars>

        <Grid container>
          <Grid item xs={12} md={8}>
            <LeftSection>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                style={{ position: 'relative', zIndex: 2 }}
              >
                <Typography
                  variant="h2"
                  component="h1"
                  gutterBottom
                  sx={{
                    fontWeight: 'bold',
                    mb: 4,
                    textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
                    background: 'linear-gradient(45deg, #fff, #e3f2fd)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Welcome Back
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 'bold',
                    mb: 4,
                    textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
                    background: 'linear-gradient(45deg, #fff, #e3f2fd)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Sign in to continue to your account
                </Typography>
                <Box sx={{ mt: 4 }}>
                  {[
                    {
                      text: "Access your personalized dashboard",
                      icon: "📊",
                      delay: 0.2,
                    },
                    {
                      text: "Manage your projects and tasks",
                      icon: "🗂️",
                      delay: 0.3,
                    },
                    {
                      text: "Stay connected with your team",
                      icon: "🤝",
                      delay: 0.4,
                    },
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: item.delay }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                          background: 'linear-gradient(135deg, #1e3c72, #2a5298)',
                          p: 2,
                          borderRadius: 3,
                          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                          mb: 2,
                          color: '#fff',
                          transition: 'transform 0.3s',
                          '&:hover': {
                            transform: 'scale(1.02)',
                          },
                        }}
                      >
                        <Box
                          sx={{
                            fontSize: '1.8rem',
                            backgroundColor: '#4fc3f7',
                            borderRadius: '50%',
                            width: 40,
                            height: 40,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#0d47a1',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                          }}
                        >
                          {item.icon}
                        </Box>
                        <Typography
                          variant="body1"
                          sx={{
                            textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                            fontWeight: 500,
                            fontSize: '1.1rem',
                          }}
                        >
                          {item.text}
                        </Typography>
                      </Box>
                    </motion.div>
                  ))}
                </Box>

              </motion.div>
            </LeftSection>
          </Grid>
          <Grid item xs={12} md={4}>
            <RightSection>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                style={{ position: 'relative', zIndex: 2 }}
              >
                <motion.div variants={itemVariants}>
                  <Typography
                    component="h1"
                    variant="h3"
                    sx={{
                      fontWeight: 800,
                      background: 'linear-gradient(45deg, #1976d2, #2196f3)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      mb: 2,
                      letterSpacing: '-0.5px',
                    }}
                  >
                    Sign In
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      mb: 4,
                      fontWeight: 500,
                      opacity: 0.8,
                      color: '#666666',
                    }}
                  >
                    Please enter your credentials to access your account
                  </Typography>
                </motion.div>

                <StyledForm onSubmit={handleSubmit}>
                  <motion.div variants={itemVariants}>
                    <TextField
                      fullWidth
                      label="Email"
                      name="email"
                      type="email"
                      value={formData.email}
                      placeholder='example@domain.com'
                      onChange={handleChange}
                      margin="normal"
                      required
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailIcon sx={{ color: '#1976d2' }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          color: '#333333',
                          borderRadius: '14px',
                          backgroundColor: '#f8f9fa',
                          transition: 'all 0.3s ease',
                          boxShadow: '0 3px 10px rgba(0, 0, 0, 0.06)',
                          '& fieldset': {
                            borderColor: '#d8d8d8',
                            '&.Mui-focused': {
                              borderColor: '#1976d2',
                            },
                          },
                          '&:hover fieldset': {
                            borderColor: '#42a5f5',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#1976d2',
                            boxShadow: '0 0 8px rgba(25, 118, 210, 0.35)',
                          },
                        },
                        '& .MuiInputLabel-root': {
                          fontWeight: 500,
                          color: '#616161',
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: '#1976d2',
                        },
                      }}
                    />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <TextField
                      fullWidth
                      label="Password"
                      name="password"
                      placeholder='*********'
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleChange}
                      margin="normal"
                      required
                      color='primary'
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockIcon sx={{ color: '#1976d2' }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                              sx={{ color: '#d3d3d3' }}
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          color: '#333333',
                          borderRadius: '14px',
                          backgroundColor: '#f8f9fa',
                          transition: 'all 0.3s ease',
                          boxShadow: '0 3px 10px rgba(0, 0, 0, 0.06)',
                          '& fieldset': {
                            borderColor: '#d8d8d8',
                            '&.Mui-focused': {
                              borderColor: '#1976d2',
                            },
                          },
                          '&:hover fieldset': {
                            borderColor: '#42a5f5',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#1976d2',
                            boxShadow: '0 0 8px rgba(25, 118, 210, 0.35)',
                          },
                        },
                        '& .MuiInputLabel-root': {
                          fontWeight: 500,
                          color: '#616161',
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: '#1976d2',
                        },
                      }}
                    />
                  </motion.div>

                  {error && (
                    <motion.div variants={itemVariants}>
                      <Typography
                        sx={{
                          mt: 2,
                          textAlign: 'center',
                          backgroundColor: 'rgba(244, 67, 54, 0.1)',
                          padding: '8px',
                          borderRadius: '8px',
                          fontWeight: 500,
                          color: '#d32f2f',
                        }}
                      >
                        {error}
                      </Typography>
                    </motion.div>
                  )}

                  <motion.div variants={itemVariants}>
                    <StyledButton
                      type="submit"
                      fullWidth
                      variant="contained"
                      disabled={loading}
                    >
                      {loading ? 'Signing in...' : 'Sign In'}
                    </StyledButton>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <Box sx={{ mt: 2, textAlign: 'center' }}>
                      <Link
                        component={RouterLink}
                        to="/forgot-password"
                        sx={{
                          color: '#1976d2',
                          textDecoration: 'none',
                          fontWeight: 600,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            textDecoration: 'underline',
                            opacity: 0.8,
                          },
                        }}
                      >
                        Forgot Password?
                      </Link>
                    </Box>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <Box sx={{ mt: 2, textAlign: 'center' }}>
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#666666',
                          '& a': {
                            color: '#1976d2',
                            textDecoration: 'none',
                            fontWeight: 600,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              textDecoration: 'underline',
                              opacity: 0.8,
                            },
                          },
                        }}
                      >
                        Don't have an account?{' '}
                        <Link
                          component={RouterLink}
                          to="/register"
                        >
                          Sign Up
                        </Link>
                      </Typography>
                    </Box>
                  </motion.div>
                </StyledForm>
              </motion.div>
            </RightSection>
          </Grid>
        </Grid>
      </FloatingStars>

    </StyledContainer>
  );
};

export default Login; 
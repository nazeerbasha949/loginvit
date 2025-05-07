import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Alert,
  Grid,
  useTheme,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import {
  Email as EmailIcon,
  ArrowBack as ArrowBackIcon,
  Send as SendIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import API from '../../API';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import bg from '../../assets/bg-1.jpg';

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
    boxShadow: '0 4px 20px rgba(33, 150, 243, 0.3)',
    '&::before': {
      transform: 'translateX(100%)',
    },
  },
}));

const ForgotPassword = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'email') {
      setEmail(value);
    } else if (name === 'otpCode') {
      setOtpCode(value);
    } else if (name === 'newPassword') {
      setNewPassword(value);
    } else if (name === 'confirmPassword') {
      setConfirmPassword(value);
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await axios.post(`${API}/auth/forgot-password`, { email });
      setOtpSent(true);
      setActiveStep(1);

      toast.success('OTP sent to your email!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      console.error('Forgot password error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to send OTP';
      setError(errorMessage);

      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    setError('');

    try {
      await axios.post(`${API}/auth/verify-otp`, {
        email,
        otpCode
      });
      setOtpVerified(true);
      setActiveStep(2);

      toast.success('OTP verified successfully!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      console.error('OTP verification error:', error);
      const errorMessage = error.response?.data?.message || 'Invalid OTP';
      setError(errorMessage);

      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await axios.post(`${API}/auth/reset-password`, {
        email,
        newPassword
      });

      toast.success('Password reset successfully!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      // Navigate to login page after a delay
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      console.error('Password reset error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to reset password';
      setError(errorMessage);

      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } finally {
      setLoading(false);
    }
  };

  const steps = ['Enter Email', 'Verify OTP', 'Reset Password'];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const stars = Array.from({ length: 50 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 1,
    duration: Math.random() * 3 + 2,
  }));

  return (
    <StyledContainer maxWidth={false} disableGutters>
      <FloatingStars>
        {stars.map((star) => (
          <Star
            key={star.id}
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 1, 0],
              y: [star.y, star.y - 50, star.y],
            }}
            transition={{
              duration: star.duration,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
            }}
          />
        ))}
      </FloatingStars>

      <Grid container>
        <Grid item xs={12} md={8}>
          <LeftSection>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              style={{ position: 'relative', zIndex: 2 }}
            >
              <motion.div variants={itemVariants}>
                <Typography
                  variant="h2"
                  sx={{
                    fontWeight: 'bold',
                    mb: 4,
                    textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
                    background: 'linear-gradient(45deg, #fff, #e3f2fd)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Reset Your Password
                </Typography>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Typography
                  variant="h5"
                  sx={{
                    mb: 6,
                    opacity: 0.9,
                    lineHeight: 1.6,
                    textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
                  }}
                >
                  Don't worry! It happens to the best of us. Follow the steps to reset your password.
                </Typography>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Typography
                  variant="body1"
                  sx={{
                    opacity: 0.9,
                    lineHeight: 1.6,
                    textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
                  }}
                >
                  Our password reset process is secure and easy to follow. You'll receive an email with an OTP to verify your identity.
                </Typography>
              </motion.div>
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
                    fontWeight: 'bold',
                    background: 'linear-gradient(45deg, #1976d2, #2196f3)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 2,
                  }}
                >
                  Forgot Password
                </Typography>
                <Typography variant="h6" color="#666666" sx={{ mb: 4 }}>
                  Follow the steps to reset your password
                </Typography>
              </motion.div>

              <Stepper
                activeStep={activeStep}
                alternativeLabel
                sx={{
                  mb: 4,
                  '& .MuiStepConnector-line': {
                    borderColor: '#29b6f6',
                    borderTopWidth: 2,
                    transition: 'all 0.3s ease-in-out',
                  },
                  '& .MuiStepIcon-root': {
                    color: '#cfd8dc', // default grayish
                    transition: 'transform 0.3s ease',
                  },
                  '& .MuiStepIcon-root.Mui-active': {
                    color: '#29b6f6',
                    transform: 'scale(1.3)',
                  },
                  '& .MuiStepIcon-root.Mui-completed': {
                    color: '#66bb6a',
                  },
                  '& .MuiStepLabel-label': {
                    color: '#90a4ae',
                    fontWeight: 500,
                    fontSize: '0.95rem',
                    letterSpacing: '0.5px',
                    transition: 'color 0.3s ease',
                  },
                  '& .MuiStepLabel-label.Mui-active': {
                    color: '#29b6f6',
                    fontWeight: 600,
                  },
                  '& .MuiStepLabel-label.Mui-completed': {
                    color: '#66bb6a',
                  },
                }}
              >
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>

              {activeStep === 0 && (
                <StyledForm onSubmit={handleSendOtp}>
                  <motion.div variants={itemVariants}>
                    <TextField
                      required
                      fullWidth
                      id="email"
                      label="Email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder='example@domain.com'
                      autoFocus
                      value={email}
                      onChange={handleChange}
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

                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                      >
                        <Alert severity="error" sx={{ mb: 2 }}>
                          {error}
                        </Alert>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <motion.div variants={itemVariants}>
                    <StyledButton
                      type="submit"
                      fullWidth
                      variant="contained"
                      disabled={loading}
                      startIcon={loading ? <CircularProgress size={24} color="inherit" /> : <SendIcon />}
                    >
                      {loading ? 'Sending...' : 'Send OTP'}
                    </StyledButton>
                  </motion.div>
                </StyledForm>
              )}

              {activeStep === 1 && (
                <Box>
                  <motion.div variants={itemVariants}>
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      id="otpCode"
                      label="Enter OTP"
                      name="otpCode"
                      placeholder="0 0 0 0 0 0"
                      value={otpCode}
                      onChange={handleChange}
                      sx={{
                        input: {
                          letterSpacing: '0.5rem',
                          fontSize: '1.4rem',
                          fontWeight: 600,
                          textAlign: 'center',
                          paddingY: '12px',
                          color: '#1a1a1a',
                        },
                        '& .MuiInputLabel-root': {
                          color: '#616161',
                          fontWeight: 500,
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: '#1976d2',
                        },
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '14px',
                          backgroundColor: '#fafafa',
                          transition: 'all 0.3s ease',
                          boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                          '& fieldset': {
                            borderColor: '#e0e0e0',
                          },
                          '&:hover fieldset': {
                            borderColor: '#42a5f5',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#1976d2',
                            boxShadow: '0 0 8px rgba(25, 118, 210, 0.4)',
                          },
                        },
                      }}
                    />
                  </motion.div>


                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                      >
                        <Alert severity="error" sx={{ mb: 2 }}>
                          {error}
                        </Alert>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <motion.div variants={itemVariants}>
                    <StyledButton
                      fullWidth
                      variant="contained"
                      disabled={loading || !otpCode}
                      onClick={handleVerifyOtp}
                      startIcon={loading ? <CircularProgress size={24} color="inherit" /> : null}
                    >
                      {loading ? 'Verifying...' : 'Verify OTP'}
                    </StyledButton>
                  </motion.div>
                </Box>
              )}

              {activeStep === 2 && (
                <Box>
                  <motion.div variants={itemVariants}>
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      name="newPassword"
                      label="New Password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder='*********'
                      id="newPassword"
                      value={newPassword}
                      onChange={handleChange}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockIcon sx={{ color: '#64b5f6' }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" sx={{ color: '#d3d3d3' }} >
                              {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
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
                            color: '#000',
                            borderColor: '#d8d8d8',
                            borderWidth: '1px',
                            borderRadius: '14px',
                            transition: 'border-color 0.3s ease',
                            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.05)',
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
                      margin="normal"
                      required
                      fullWidth
                      name="confirmPassword"
                      label="Confirm Password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      value={confirmPassword}
                      placeholder='*********'
                      onChange={handleChange}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockIcon sx={{ color: '#64b5f6' }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end" sx={{ color: '#d3d3d3' }}>
                              {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
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


                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                      >
                        <Alert severity="error" sx={{ mb: 2 }}>
                          {error}
                        </Alert>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <motion.div variants={itemVariants}>
                    <StyledButton
                      fullWidth
                      variant="contained"
                      disabled={loading || !newPassword || !confirmPassword}
                      onClick={handleResetPassword}
                      startIcon={loading ? <CircularProgress size={24} color="inherit" /> : null}
                    >
                      {loading ? 'Resetting...' : 'Reset Password'}
                    </StyledButton>
                  </motion.div>
                </Box>
              )}

              <motion.div variants={itemVariants}>
                <Typography
                  variant="body2"
                  color="#666666"
                  align="center"
                  sx={{ mt: 2 }}
                >
                  Remember your password?{' '}
                  <Link
                    to="/login"
                    style={{
                      textDecoration: 'none',
                      color: theme.palette.primary.main,
                      fontWeight: 'bold',
                    }}
                  >
                    Sign In
                  </Link>
                </Typography>
              </motion.div>
            </motion.div>
          </RightSection>
        </Grid>
      </Grid>
    </StyledContainer>
  );
};

export default ForgotPassword; 
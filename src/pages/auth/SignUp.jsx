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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  ArrowBack as ArrowBackIcon,
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

const SignUp = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'Employee',
    category: 'Developer',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('All fields are required');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      await axios.post(`${API}/auth/register`, {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        category: formData.category,
      });

      toast.success('Account created successfully! Please login.', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      navigate('/login');
    } catch (error) {
      console.error('Signup error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to create account';
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
                  Join Our Community
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
                  Create your account and start your journey with us. We're excited to have you on board!
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
                  By signing up, you'll get access to all our features and be part of our growing community.
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
                  Sign Up
                </Typography>
                <Typography variant="h6" color="#666666" sx={{ mb: 4 }}>
                  Create your account
                </Typography>
              </motion.div>

              <StyledForm onSubmit={handleSubmit}>
                <motion.div variants={itemVariants}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="name"
                    label="Full Name"
                    name="name"
                    autoComplete="name"
                    autoFocus
                    value={formData.name}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon sx={{ color: '#1976d2' }} />
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
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    value={formData.email}
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

                <motion.div variants={itemVariants}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    autoComplete="new-password"
                    value={formData.password}
                    onChange={handleChange}
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
                    margin="normal"
                    required
                    fullWidth
                    name="confirmPassword"
                    label="Confirm Password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    autoComplete="new-password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon sx={{ color: '#1976d2' }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            edge="end"
                            sx={{ color: '#d3d3d3' }}
                          >
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

                <motion.div variants={itemVariants}>
                  <FormControl
                    fullWidth
                    margin="normal"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        color: '#333333',
                        borderRadius: '14px',
                        background: '#f8f9fa',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                        transition: 'all 0.3s ease-in-out',
                        '& fieldset': {
                          borderColor: '#d8d8d8',
                          borderWidth: '2px',
                          '&.Mui-focused': {
                            borderColor: '#1976d2',
                          },
                        },
                        '&:hover fieldset': {
                          borderColor: '#42a5f5',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#1976d2',
                          boxShadow: '0 0 10px rgba(25, 118, 210, 0.25)',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        // fontWeight: 600,
                        color: '#555',
                        transition: 'all 0.3s ease',
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: '#1976d2',
                      },
                      '& .MuiSvgIcon-root': {
                        color: '#1976d2',
                      },
                    }}
                  >
                    <InputLabel id="role-label">Role</InputLabel>
                    <Select
                      labelId="role-label"
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      label="Role"
                    // startAdornment={
                    //   <InputAdornment position="start">
                    //     <Box
                    //       sx={{
                    //         backgroundColor: '#1976d2',
                    //         borderRadius: '50%',
                    //         width: 30,
                    //         height: 30,
                    //         display: 'flex',
                    //         alignItems: 'center',
                    //         justifyContent: 'center',
                    //         mr: 1,
                    //         boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
                    //       }}
                    //     >
                    //       <PersonIcon sx={{ color: '#fff', fontSize: 18 }} />
                    //     </Box>
                    //   </InputAdornment>
                    // }
                    >
                      <MenuItem value="Employee">👔 Employee</MenuItem>
                      <MenuItem value="Admin">🛡️ Admin</MenuItem>
                    </Select>
                  </FormControl>
                </motion.div>


                <motion.div variants={itemVariants}>
                  <FormControl
                    fullWidth
                    margin="normal"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        color: '#333333',
                        borderRadius: '14px',
                        background: '#f8f9fa',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                        transition: 'all 0.3s ease-in-out',
                        '& fieldset': {
                          borderColor: '#d8d8d8',
                          borderWidth: '2px',
                          '&.Mui-focused': {
                            borderColor: '#1976d2',
                          },
                        },
                        '&:hover fieldset': {
                          borderColor: '#42a5f5',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#1976d2',
                          boxShadow: '0 0 10px rgba(25, 118, 210, 0.25)',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        // fontWeight: 600,
                        color: '#555',
                        transition: 'all 0.3s ease',
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: '#1976d2',
                      },
                      '& .MuiSvgIcon-root': {
                        color: '#1976d2',
                      },
                    }}
                  >
                    <InputLabel id="category-label">Category</InputLabel>
                    <Select
                      labelId="category-label"
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      label="Category"

                    >
                      <MenuItem value="Developer">
                        💻 <span style={{ marginLeft: 8, fontWeight: 500 }}>Developer</span>
                      </MenuItem>
                      <MenuItem value="HR">
                        🧑‍💼 <span style={{ marginLeft: 8, fontWeight: 500 }}>HR</span>
                      </MenuItem>
                      <MenuItem value="DevOps">
                        ⚙️ <span style={{ marginLeft: 8, fontWeight: 500 }}>DevOps</span>
                      </MenuItem>

                    </Select>
                  </FormControl>
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
                    startIcon={loading ? <CircularProgress size={24} color="inherit" /> : null}
                  >
                    {loading ? 'Creating Account...' : 'Sign Up'}
                  </StyledButton>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Typography
                    variant="body2"
                    color="#666666"
                    align="center"
                    sx={{ mt: 2 }}
                  >
                    Already have an account?{' '}
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
              </StyledForm>
            </motion.div>
          </RightSection>
        </Grid>
      </Grid>
    </StyledContainer>
  );
};

export default SignUp; 
import React, { useState, useEffect, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ThemeContext } from '../../theme/ThemeProvider';
import axios from 'axios';
import API from '../../API';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  Alert,
  Avatar,
  Tabs,
  Tab,
  Divider,
  Chip,
  IconButton,
  CircularProgress,
  useTheme,
  alpha,
  Card,
  CardContent,
  Badge,
  Tooltip,
  Fade,
  Backdrop,
  MenuItem,
  Snackbar,
  Modal,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Work as WorkIcon,
  Category as CategoryIcon,
  VpnKey as PasswordIcon,
  PhotoCamera as CameraIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Settings as SettingsIcon,
  Cake as CakeIcon,
  CalendarToday as CalendarIcon,
  AccountTree as HierarchyIcon,
  SupervisorAccount as SupervisorIcon,
  Group as TeamIcon,
  MoreVert as MoreIcon,
  Info as InfoIcon,
  Message as MessageIcon,
  Assignment as TaskIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { updateProfile } from '../../store/slices/authSlice';
import { format } from 'date-fns';
import { Tree, TreeNode } from 'react-organizational-chart';
import { useNavigate } from 'react-router-dom';

// Styled components
const StyledPaper = styled(Paper)(({ theme, isDarkMode }) => ({
  borderRadius: 16,
  overflow: 'hidden',
  boxShadow: isDarkMode 
    ? '0 8px 32px rgba(0, 0, 0, 0.4)' 
    : '0 8px 32px rgba(0, 0, 0, 0.1)',
  background: isDarkMode 
    ? 'linear-gradient(to bottom, #1a2035, #121a2e)' 
    : 'linear-gradient(to bottom, #ffffff, #f8f9fa)',
  border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid rgba(0, 0, 0, 0.05)',
}));

const ProfileAvatar = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}));

const StyledTab = styled(Tab)(({ theme, isDarkMode }) => ({
  minHeight: 60,
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '0.95rem',
  transition: 'all 0.3s ease',
  borderRadius: '8px',
  margin: '0 8px',
  opacity: 0.7,
  '&.Mui-selected': {
    opacity: 1,
    backgroundColor: isDarkMode ? alpha(theme.palette.primary.main, 0.15) : alpha(theme.palette.primary.main, 0.1),
  },
  '&:hover': {
    backgroundColor: isDarkMode ? alpha('#fff', 0.05) : alpha('#000', 0.05),
    opacity: 0.9,
  },
}));

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const StyledTreeNode = styled(Box)(({ theme, isDarkMode }) => ({
  padding: '16px',
  borderRadius: '8px',
  display: 'inline-block',
  border: `2px solid ${theme.palette.primary.main}`,
  backgroundColor: isDarkMode ? alpha(theme.palette.primary.main, 0.1) : alpha(theme.palette.primary.main, 0.05),
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: isDarkMode ? alpha(theme.palette.primary.main, 0.2) : alpha(theme.palette.primary.main, 0.1),
    transform: 'translateY(-3px)',
    boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
  },
}));

const StyledOrgChart = styled(Box)(({ theme }) => ({
  overflowX: 'auto',
  padding: theme.spacing(3),
  '& ul': {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  '& li': {
    padding: 0,
    margin: 0,
  },
}));

const profileSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup.string().matches(/^[0-9]{10}$/, 'Phone number must be 10 digits'),
  category: yup.string(),
});

const passwordSchema = yup.object().shape({
  currentPassword: yup.string().required('Current password is required'),
  newPassword: yup
    .string()
    .required('New password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
    ),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('newPassword'), null], 'Passwords must match')
    .required('Confirm password is required'),
});

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const { isDarkMode } = useContext(ThemeContext);
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [profileImage, setProfileImage] = useState(user?.profilePic || null);
  const [imagePreview, setImagePreview] = useState(user?.profilePic || null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [organizationData, setOrganizationData] = useState([]);
  const [orgChartLoading, setOrgChartLoading] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [openEmployeeModal, setOpenEmployeeModal] = useState(false);
  const [teamMembers, setTeamMembers] = useState([]);
  const [teamLoading, setTeamLoading] = useState(false);

  const {
    control: profileControl,
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
  } = useForm({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      category: user?.category || '',
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    reset: resetPasswordForm,
  } = useForm({
    resolver: yupResolver(passwordSchema),
  });

  // Fetch organization data for hierarchy chart (CEO and Manager only)
  useEffect(() => {
    if (user?.role === 'CEO' || user?.role === 'Manager') {
      fetchOrganizationData();
    }
  }, [user]);

  // Fetch team members for managers and employees
  useEffect(() => {
    if (user?.role === 'Manager' || user?.role === 'Employee') {
      fetchTeamMembers();
    }
  }, [user]);

  const fetchOrganizationData = async () => {
    try {
      setOrgChartLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.get(`${API}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      // Process data for org chart
      const orgData = processOrgData(response.data.users);
      setOrganizationData(orgData);
    } catch (err) {
      console.error('Error fetching organization data:', err);
    } finally {
      setOrgChartLoading(false);
    }
  };

  const fetchTeamMembers = async () => {
    try {
      setTeamLoading(true);
      const token = localStorage.getItem('token');
      
      // For a real app, you would have an endpoint to get team members
      // This is a simplified example
      const response = await axios.get(`${API}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      // Filter users based on category for team members
      let filteredUsers = [];
      
      if (user?.role === 'Manager') {
        // Managers see all employees in their category
        filteredUsers = response.data.users.filter(
          (u) => u.role === 'Employee' && u.category === user.category
        );
      } else if (user?.role === 'Employee') {
        // Employees see other employees in their category
        filteredUsers = response.data.users.filter(
          (u) => u._id !== user.id && u.category === user.category
        );
      }
      
      setTeamMembers(filteredUsers);
    } catch (err) {
      console.error('Error fetching team members:', err);
    } finally {
      setTeamLoading(false);
    }
  };

  // Process organization data for hierarchy chart
  const processOrgData = (users) => {
    const ceo = users.find(u => u.role === 'CEO');
    const managers = users.filter(u => u.role === 'Manager');
    const employees = users.filter(u => u.role === 'Employee');
    
    // Group employees by category
    const employeesByCategory = {};
    employees.forEach(emp => {
      if (!employeesByCategory[emp.category]) {
        employeesByCategory[emp.category] = [];
      }
      employeesByCategory[emp.category].push(emp);
    });
    
    // Create hierarchy
    const hierarchy = {
      ...ceo,
      children: managers.map(manager => ({
        ...manager,
        children: employeesByCategory[manager.category] || []
      }))
    };
    
    return hierarchy;
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleTogglePassword = (field) => {
    setShowPassword({
      ...showPassword,
      [field]: !showPassword[field],
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setProfileImage(file);
    }
  };

  const uploadProfileImage = async () => {
    if (!profileImage) return null;
    
    try {
      setUploadLoading(true);
      const formData = new FormData();
      formData.append('profilePic', profileImage);
      
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API}/users/upload-profile-pic`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      
      return response.data.imageUrl;
    } catch (err) {
      console.error('Error uploading image:', err);
      setError('Failed to upload profile image');
      return null;
    } finally {
      setUploadLoading(false);
    }
  };

  const onProfileSubmit = async (data) => {
    try {
      setLoading(true);
      setError(null);
      
      // Upload profile image if changed
      let profilePicUrl = user?.profilePic;
      if (profileImage && profileImage !== user?.profilePic) {
        profilePicUrl = await uploadProfileImage();
      }
      
      const token = localStorage.getItem('token');
      const userId = user?.id;
      
      const updatedData = {
        ...data,
        profilePic: profilePicUrl,
      };
      
      const response = await axios.put(`${API}/users/${userId}`, updatedData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      dispatch(updateProfile({
        ...user,
        ...updatedData,
      }));
      
      setSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const onPasswordSubmit = async (data) => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      const userId = user?.id;
      
      const response = await axios.post(`${API}/users/change-password`, {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      resetPasswordForm();
      setSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'CEO':
        return '#FF6B6B';
      case 'Manager':
        return '#4ECDC4';
      case 'Employee':
        return '#FFD166';
      default:
        return '#6B7280';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'HR':
        return '#8A2BE2';
      case 'Developer':
        return '#3498DB';
      case 'DevOps':
        return '#2ECC71';
      default:
        return '#6B7280';
    }
  };

  const handleEmployeeClick = (employee) => {
    setSelectedEmployee(employee);
    setOpenEmployeeModal(true);
  };

  const handleCloseEmployeeModal = () => {
    setOpenEmployeeModal(false);
    setSelectedEmployee(null);
  };

  const handleMessageEmployee = (employeeId) => {
    // Navigate to chat with this employee
    navigate(`/chat?userId=${employeeId}`);
  };

  // Render organization chart (for CEO and Manager)
  const renderOrgChart = () => {
    if (!organizationData || !organizationData._id) {
      return (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body1" color="text.secondary">
            No organization data available
          </Typography>
        </Box>
      );
    }

    const renderNode = (node) => {
      if (!node) return null;
      
      return (
        <TreeNode 
          label={
            <StyledTreeNode 
              isDarkMode={isDarkMode} 
              onClick={() => handleEmployeeClick(node)}
              sx={{
                borderColor: getRoleColor(node.role),
                backgroundColor: alpha(getRoleColor(node.role), isDarkMode ? 0.2 : 0.1),
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Avatar 
                  src={node.profilePic} 
                  alt={node.name}
                  sx={{ 
                    width: 40, 
                    height: 40,
                    border: `2px solid ${getRoleColor(node.role)}`,
                  }}
                >
                  {node.name ? node.name.charAt(0).toUpperCase() : <PersonIcon />}
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {node.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {node.role} {node.category && `• ${node.category}`}
                  </Typography>
                </Box>
              </Box>
            </StyledTreeNode>
          }
        >
          {node.children && node.children.map((child, index) => (
            <React.Fragment key={child._id || index}>
              {renderNode(child)}
            </React.Fragment>
          ))}
        </TreeNode>
      );
    };

    return (
      <StyledOrgChart>
        <Tree
          lineWidth="2px"
          lineColor={theme.palette.primary.main}
          lineBorderRadius="10px"
        >
          {renderNode(organizationData)}
        </Tree>
      </StyledOrgChart>
    );
  };

  // Render team members list (for Manager and Employee)
  const renderTeamMembers = () => {
    if (teamLoading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      );
    }

    if (teamMembers.length === 0) {
      return (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body1" color="text.secondary">
            No team members found
          </Typography>
        </Box>
      );
    }

    return (
      <List>
        {teamMembers.map((member) => (
          <ListItem
            key={member._id}
            sx={{
              mb: 2,
              borderRadius: 2,
              backgroundColor: isDarkMode 
                ? alpha(theme.palette.background.paper, 0.2) 
                : alpha(theme.palette.background.paper, 0.7),
              '&:hover': {
                backgroundColor: isDarkMode 
                  ? alpha(theme.palette.background.paper, 0.3) 
                  : alpha(theme.palette.background.paper, 0.9),
              },
            }}
          >
            <ListItemAvatar>
              <Avatar 
                src={member.profilePic} 
                alt={member.name}
                sx={{ 
                  width: 50, 
                  height: 50,
                  border: `2px solid ${getRoleColor(member.role)}`,
                }}
              >
                {member.name ? member.name.charAt(0).toUpperCase() : <PersonIcon />}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={
                <Typography variant="subtitle1" fontWeight="bold">
                  {member.name}
                </Typography>
              }
              secondary={
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    {member.email}
                  </Typography>
                  <Box sx={{ display: 'flex', mt: 1, gap: 1 }}>
                    <Chip 
                      size="small" 
                      label={member.role} 
                      sx={{ 
                        backgroundColor: alpha(getRoleColor(member.role), 0.8),
                        color: 'white',
                      }} 
                    />
                    {member.category && (
                      <Chip 
                        size="small" 
                        label={member.category} 
                        sx={{ 
                          backgroundColor: alpha(getCategoryColor(member.category), 0.8),
                          color: 'white',
                        }} 
                      />
                    )}
                  </Box>
                </Box>
              }
            />
            <ListItemSecondaryAction>
              <Tooltip title="View Profile">
                <IconButton 
                  edge="end" 
                  onClick={() => handleEmployeeClick(member)}
                  sx={{ mr: 1 }}
                >
                  <InfoIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Message">
                <IconButton 
                  edge="end" 
                  onClick={() => handleMessageEmployee(member._id)}
                  color="primary"
                >
                  <MessageIcon />
                </IconButton>
              </Tooltip>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    );
  };

  // Employee detail modal
  const renderEmployeeModal = () => {
    if (!selectedEmployee) return null;

    return (
      <Dialog
        open={openEmployeeModal}
        onClose={handleCloseEmployeeModal}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          pb: 1
        }}>
          <Typography variant="h6">Employee Profile</Typography>
          <IconButton onClick={handleCloseEmployeeModal}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Avatar
              src={selectedEmployee.profilePic}
              alt={selectedEmployee.name}
              sx={{
                width: 100,
                height: 100,
                margin: '0 auto',
                border: `3px solid ${getRoleColor(selectedEmployee.role)}`,
              }}
            >
              {selectedEmployee.name ? selectedEmployee.name.charAt(0).toUpperCase() : <PersonIcon />}
            </Avatar>
            <Typography variant="h5" sx={{ mt: 2, fontWeight: 'bold' }}>
              {selectedEmployee.name}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 1 }}>
              <Chip
                label={selectedEmployee.role}
                sx={{
                  backgroundColor: alpha(getRoleColor(selectedEmployee.role), 0.8),
                  color: 'white',
                }}
              />
              {selectedEmployee.category && (
                <Chip
                  label={selectedEmployee.category}
                  sx={{
                    backgroundColor: alpha(getCategoryColor(selectedEmployee.category), 0.8),
                    color: 'white',
                  }}
                />
              )}
            </Box>
          </Box>
          
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="text.secondary">
                Email
              </Typography>
              <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                <EmailIcon sx={{ mr: 1, fontSize: 20, color: theme.palette.primary.main }} />
                {selectedEmployee.email}
              </Typography>
            </Grid>
            
            {selectedEmployee.phone && (
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">
                  Phone
                </Typography>
                <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                  <PhoneIcon sx={{ mr: 1, fontSize: 20, color: theme.palette.primary.main }} />
                  {selectedEmployee.phone}
                </Typography>
              </Grid>
            )}
            
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="text.secondary">
                Status
              </Typography>
              <Chip
                label={selectedEmployee.status === 'active' ? 'Active' : 'Inactive'}
                size="small"
                sx={{
                  mt: 0.5,
                  backgroundColor: selectedEmployee.status === 'active' ? '#4caf50' : '#f44336',
                  color: 'white',
                }}
              />
            </Grid>
            
            {selectedEmployee.createdAt && (
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">
                  Joined
                </Typography>
                <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                  <CalendarIcon sx={{ mr: 1, fontSize: 20, color: theme.palette.primary.main }} />
                  {format(new Date(selectedEmployee.createdAt), 'MMMM dd, yyyy')}
                </Typography>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button 
            variant="outlined" 
            onClick={handleCloseEmployeeModal}
            startIcon={<CloseIcon />}
          >
            Close
          </Button>
          <Button 
            variant="contained" 
            color="primary"
            startIcon={<MessageIcon />}
            onClick={() => {
              handleCloseEmployeeModal();
              handleMessageEmployee(selectedEmployee._id);
            }}
          >
            Message
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <StyledPaper elevation={3} isDarkMode={isDarkMode} sx={{ p: 0, overflow: 'hidden' }}>
          {/* Profile Header */}
          <Box
            sx={{
              p: 4,
              background: isDarkMode
                ? 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)'
                : 'linear-gradient(135deg, #2b5a9e 0%, #1976d2 100%)',
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
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
            }}
          >
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={3} sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                <Box sx={{ position: 'relative', display: 'inline-block' }}>
                  <ProfileAvatar
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    variant="dot"
                    sx={{ mb: 2 }}
                  >
                    <Avatar
                      src={imagePreview}
                      alt={user?.name}
                      sx={{
                        width: 120,
                        height: 120,
                        border: '4px solid white',
                        boxShadow: '0 4px 14px rgba(0, 0, 0, 0.1)',
                      }}
                    >
                      {user?.name ? user.name.charAt(0).toUpperCase() : <PersonIcon />}
                    </Avatar>
                  </ProfileAvatar>
                  <Tooltip title="Change profile picture">
                    <IconButton
                      color="primary"
                      aria-label="upload picture"
                      component="label"
                      sx={{
                        position: 'absolute',
                        bottom: 10,
                        right: 0,
                        backgroundColor: 'white',
                        '&:hover': { backgroundColor: '#f5f5f5' },
                      }}
                    >
                      <VisuallyHiddenInput
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                      <CameraIcon sx={{ color: theme.palette.primary.main }} />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Grid>
              <Grid item xs={12} md={9}>
                <Box sx={{ position: 'relative', zIndex: 1 }}>
                  <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
                    {user?.name}
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    <Chip
                      label={user?.role || 'Employee'}
                      sx={{
                        backgroundColor: alpha(getRoleColor(user?.role), 0.9),
                        color: 'white',
                        fontWeight: 'bold',
                      }}
                    />
                    {user?.category && (
                      <Chip
                        label={user?.category}
                        sx={{
                          backgroundColor: alpha(getCategoryColor(user?.category), 0.9),
                          color: 'white',
                        }}
                        icon={<CategoryIcon sx={{ color: 'white !important' }} />}
                      />
                    )}
                    <Chip
                      label={user?.status === 'active' ? 'Active' : 'Inactive'}
                      sx={{
                        backgroundColor: user?.status === 'active' ? '#4caf50' : '#f44336',
                        color: 'white',
                      }}
                    />
                  </Box>
                  <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <EmailIcon sx={{ mr: 1, fontSize: 20 }} />
                    {user?.email}
                  </Typography>
                  {user?.phone && (
                    <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <PhoneIcon sx={{ mr: 1, fontSize: 20 }} />
                      {user?.phone}
                    </Typography>
                  )}
                  {user?.createdAt && (
                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', opacity: 0.8 }}>
                      <CalendarIcon sx={{ mr: 1, fontSize: 18 }} />
                      Joined {format(new Date(user.createdAt), 'MMMM dd, yyyy')}
                    </Typography>
                  )}
                </Box>
              </Grid>
            </Grid>
          </Box>

          {/* Tabs Navigation */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 3 }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              aria-label="profile tabs"
              variant="scrollable"
              scrollButtons="auto"
              sx={{ 
                '& .MuiTabs-indicator': {
                  backgroundColor: theme.palette.primary.main,
                  height: 3,
                  borderRadius: '3px 3px 0 0',
                }
              }}
            >
              <StyledTab 
                label="Profile Information" 
                icon={<PersonIcon />} 
                iconPosition="start"
                isDarkMode={isDarkMode}
              />
              <StyledTab 
                label="Change Password" 
                icon={<PasswordIcon />} 
                iconPosition="start"
                isDarkMode={isDarkMode}
              />
              <StyledTab 
                label="Preferences" 
                icon={<SettingsIcon />} 
                iconPosition="start"
                isDarkMode={isDarkMode}
              />
            </Tabs>
          </Box>

          {/* Tab Content */}
          <Box sx={{ p: 4 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}
            
            {success && (
              <Alert severity="success" sx={{ mb: 3 }}>
                {activeTab === 0
                  ? 'Profile updated successfully'
                  : activeTab === 1
                  ? 'Password changed successfully'
                  : 'Preferences saved successfully'}
              </Alert>
            )}

            {/* Profile Information Tab */}
            {activeTab === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <form onSubmit={handleProfileSubmit(onProfileSubmit)}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Full Name"
                        variant="outlined"
                        InputProps={{
                          startAdornment: (
                            <PersonIcon sx={{ mr: 1, color: theme.palette.text.secondary }} />
                          ),
                        }}
                        {...registerProfile('name')}
                        error={!!profileErrors.name}
                        helperText={profileErrors.name?.message}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Email Address"
                        variant="outlined"
                        InputProps={{
                          startAdornment: (
                            <EmailIcon sx={{ mr: 1, color: theme.palette.text.secondary }} />
                          ),
                        }}
                        {...registerProfile('email')}
                        error={!!profileErrors.email}
                        helperText={profileErrors.email?.message}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Phone Number"
                        variant="outlined"
                        InputProps={{
                          startAdornment: (
                            <PhoneIcon sx={{ mr: 1, color: theme.palette.text.secondary }} />
                          ),
                        }}
                        {...registerProfile('phone')}
                        error={!!profileErrors.phone}
                        helperText={profileErrors.phone?.message}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        select
                        fullWidth
                        label="Department/Category"
                        variant="outlined"
                        InputProps={{
                          startAdornment: (
                            <WorkIcon sx={{ mr: 1, color: theme.palette.text.secondary }} />
                          ),
                        }}
                        {...registerProfile('category')}
                        error={!!profileErrors.category}
                        helperText={profileErrors.category?.message}
                        disabled={user?.role === 'CEO' || user?.role === 'Manager'}
                      >
                        <MenuItem value="">None</MenuItem>
                        <MenuItem value="HR">HR</MenuItem>
                        <MenuItem value="Developer">Developer</MenuItem>
                        <MenuItem value="DevOps">DevOps</MenuItem>
                      </TextField>
                    </Grid>
                  </Grid>
                  <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      size="large"
                      startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                      disabled={loading}
                      sx={{
                        borderRadius: 2,
                        px: 4,
                        py: 1.5,
                        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                        boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
                      }}
                    >
                      {loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </Box>
                </form>
              </motion.div>
            )}

            {/* Change Password Tab */}
            {activeTab === 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <form onSubmit={handlePasswordSubmit(onPasswordSubmit)}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Current Password"
                        type={showPassword.current ? 'text' : 'password'}
                        variant="outlined"
                        InputProps={{
                          startAdornment: (
                            <PasswordIcon sx={{ mr: 1, color: theme.palette.text.secondary }} />
                          ),
                          endAdornment: (
                            <IconButton
                              onClick={() => handleTogglePassword('current')}
                              edge="end"
                            >
                              {showPassword.current ? <VisibilityOffIcon /> : <VisibilityIcon />}
                            </IconButton>
                          ),
                        }}
                        {...registerPassword('currentPassword')}
                        error={!!passwordErrors.currentPassword}
                        helperText={passwordErrors.currentPassword?.message}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="New Password"
                        type={showPassword.new ? 'text' : 'password'}
                        variant="outlined"
                        InputProps={{
                          startAdornment: (
                            <PasswordIcon sx={{ mr: 1, color: theme.palette.text.secondary }} />
                          ),
                          endAdornment: (
                            <IconButton
                              onClick={() => handleTogglePassword('new')}
                              edge="end"
                            >
                              {showPassword.new ? <VisibilityOffIcon /> : <VisibilityIcon />}
                            </IconButton>
                          ),
                        }}
                        {...registerPassword('newPassword')}
                        error={!!passwordErrors.newPassword}
                        helperText={passwordErrors.newPassword?.message}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Confirm New Password"
                        type={showPassword.confirm ? 'text' : 'password'}
                        variant="outlined"
                        InputProps={{
                          startAdornment: (
                            <PasswordIcon sx={{ mr: 1, color: theme.palette.text.secondary }} />
                          ),
                          endAdornment: (
                            <IconButton
                              onClick={() => handleTogglePassword('confirm')}
                              edge="end"
                            >
                              {showPassword.confirm ? <VisibilityOffIcon /> : <VisibilityIcon />}
                            </IconButton>
                          ),
                        }}
                        {...registerPassword('confirmPassword')}
                        error={!!passwordErrors.confirmPassword}
                        helperText={passwordErrors.confirmPassword?.message}
                      />
                    </Grid>
                  </Grid>
                  <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      size="large"
                      startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                      disabled={loading}
                      sx={{
                        borderRadius: 2,
                        px: 4,
                        py: 1.5,
                        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                        boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
                      }}
                    >
                      {loading ? 'Changing...' : 'Change Password'}
                    </Button>
                  </Box>
                </form>
              </motion.div>
            )}

            {/* Preferences Tab */}
            {activeTab === 2 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Box sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                    User preferences coming soon
                  </Typography>
                  <SettingsIcon sx={{ fontSize: 60, color: 'text.disabled', opacity: 0.5 }} />
                </Box>
              </motion.div>
            )}
          </Box>
        </StyledPaper>
      </motion.div>

      {/* Loading backdrop for image upload */}
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={uploadLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Container>
  );
};

export default Profile;
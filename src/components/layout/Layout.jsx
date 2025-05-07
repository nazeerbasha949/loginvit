import React, { useState, useContext, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Avatar,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
  Tooltip,
  Badge,
  Paper,
  alpha,
  Button,
} from '@mui/material';
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  Dashboard as DashboardIcon,
  CalendarMonth as CalendarIcon,
  Task as TaskIcon,
  Chat as ChatIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  Logout as LogoutIcon,
  Notifications as NotificationsIcon,
  MenuOpen as MenuOpenIcon,
  People as PeopleIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { logoutUser } from '../../store/slices/authSlice';
import { ThemeContext } from '../../theme/ThemeProvider';
import { motion } from 'framer-motion';

const drawerWidth = 295;
const collapsedDrawerWidth = 50;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
    ...(!open && {
      marginLeft: `-${collapsedDrawerWidth}px`,
    }),
  }),
);

const AppBarStyled = styled(AppBar, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    background: theme.palette.mode === 'dark' 
      ? 'linear-gradient(135deg, rgba(25, 118, 210, 0.1) 0%, rgba(13, 71, 161, 0.1) 100%)'
      : 'linear-gradient(135deg, rgba(25, 118, 210, 0.05) 0%, rgba(13, 71, 161, 0.05) 100%)',
    backdropFilter: 'blur(10px)',
    boxShadow: theme.palette.mode === 'dark'
      ? '0 4px 20px rgba(0, 0, 0, 0.2)'
      : '0 4px 20px rgba(0, 0, 0, 0.08)',
    borderBottom: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)'}`,
    ...(open && {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: `${drawerWidth}px`,
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
    ...(!open && {
      width: '100%',
      marginLeft: 0,
    }),
  }),
);

const DrawerHeader = styled('div')(({ theme, collapsed }) => ({
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  height: '10.3%',
  padding: theme.spacing(0, collapsed ? 0 : 1),
  ...theme.mixins.toolbar,
  // justifyContent: collapsed ? 'center' : 'flex-end',
  justifyContent: 'center',
  minHeight: collapsed ? '60px' : 'auto',
}));

const StyledDrawer = styled(Drawer)(({ theme, open }) => ({
  width: open ? drawerWidth : collapsedDrawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  '& .MuiDrawer-paper': {
    width: open ? drawerWidth : collapsedDrawerWidth,
    boxSizing: 'border-box',
    background: theme.palette.mode === 'dark' 
      ? 'linear-gradient(180deg, rgba(25, 118, 210, 0.05) 0%, rgba(13, 71, 161, 0.05) 100%)'
      : 'linear-gradient(180deg, rgba(25, 118, 210, 0.02) 0%, rgba(13, 71, 161, 0.02) 100%)',
    color: theme.palette.mode === 'dark' ? '#fff' : theme.palette.text.primary,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
    borderRight: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)'}`,
    boxShadow: theme.palette.mode === 'dark'
      ? '4px 0 20px rgba(0, 0, 0, 0.2)'
      : '4px 0 20px rgba(0, 0, 0, 0.08)',
    backdropFilter: 'blur(10px)',
    display: 'flex',
    flexDirection: 'column',
    '&::-webkit-scrollbar': {
      display: 'none'
    },
  },
}));

const StyledListItemButton = styled(ListItemButton)(({ theme, selected, collapsed }) => ({
  margin: collapsed ? '4px 0' : '8px 12px',
  borderRadius: collapsed ? '0' : '12px',
  transition: 'all 0.3s ease',
  justifyContent: collapsed ? 'center' : 'flex-start',
  minHeight: collapsed ? '48px' : 'auto',
  padding: collapsed ? '8px 0' : '8px 12px',
  height: '60px',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
    transform: collapsed ? 'none' : 'translateX(4px)',
    '& .MuiListItemIcon-root': {
      transform: 'scale(1.1)',
    }
  },
  '&:active': {
    transform: collapsed ? 'none' : 'translateX(6px) scale(0.98)',
  },
  ...(selected && {
    backgroundColor: alpha(theme.palette.primary.main, 0.2),
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, 0.3),
    },
    '&::before': {
      content: '""',
      position: 'absolute',
      left: 0,
      top: '50%',
      transform: 'translateY(-50%)',
      height: '70%',
      width: 4,
      backgroundColor: theme.palette.primary.main,
      borderRadius: 1,
      opacity: 1,
      transition: 'all 0.3s ease',
    }
  }),
}));

const StyledListItemIcon = styled(ListItemIcon)(({ theme, collapsed }) => ({
  minWidth: collapsed ? 0 : 40,
  color: theme.palette.mode === 'dark' ? '#fff' : theme.palette.primary.main,
  margin: collapsed ? 0 : '0 12px 0 0',
  fontSize: collapsed ? '1.5rem' : '1.25rem',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  transition: 'transform 0.2s ease',
  '& .MuiSvgIcon-root': {
    fontSize: collapsed ? '1.5rem' : '1.25rem',
  }
}));

const LogoContainer = styled(Box)(({ theme, collapsed }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: collapsed ? 'center' : 'center',
  padding: collapsed ? theme.spacing(1) : theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

const Logo = styled(Typography)(({ theme, collapsed }) => ({
  fontWeight: 900,
  fontSize: collapsed ? '1.2rem' : '1.8rem',
  background: theme.palette.mode === 'dark' 
    ? 'linear-gradient(45deg, #64b5f6 30%, #42a5f5 90%)'
    : 'linear-gradient(45deg, #2196f3 30%, #1976d2 90%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  textAlign: 'center',
}));

const Layout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [open, setOpen] = useState(!isMobile);
  const [anchorEl, setAnchorEl] = useState(null);
  const { toggleTheme, isDarkMode } = useContext(ThemeContext);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  // Initialize theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme && savedTheme !== (isDarkMode ? 'dark' : 'light')) {
      toggleTheme();
    }
  }, []);

  const handleThemeChange = () => {
    toggleTheme();
    // Store theme preference in localStorage
    localStorage.setItem('theme', isDarkMode ? 'light' : 'dark');
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      const result = await dispatch(logoutUser()).unwrap();
      if (result) {
        navigate('/login', { replace: true });
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Calendar', icon: <CalendarIcon />, path: '/calendar' },
    { text: 'Tasks', icon: <TaskIcon />, path: '/tasks' },
    { text: 'Chat', icon: <ChatIcon />, path: '/chat' },
    // { text: 'Profile', icon: <PersonIcon />, path: '/profile' },
    { text: 'Employee Management', icon: <PeopleIcon />, path: '/employees' },
  ];

  if (user?.role === 'CEO') {
    menuItems.push(
      { text: 'Employee Management', icon: <SettingsIcon />, path: '/admin/employees' },
      { text: 'Holiday Management', icon: <SettingsIcon />, path: '/admin/holidays' }
    );
  }

  return (
    <Box sx={{ 
      display: 'flex',
      bgcolor: isDarkMode ? '#151b3b' : '#f5f5f5',
      minHeight: '100vh',
      transition: 'all 0.3s ease',
      background: isDarkMode
        ? 'linear-gradient(135deg, #151b3b 0%, #19234d 100%)'
        : 'linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%)',
    }}>
      <AppBarStyled position="fixed" open={open}>
        <Toolbar sx={{ justifyContent: 'space-between', height: 80, px: 1 }}>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}>
            <IconButton
              onClick={() => setOpen(!open)}
              sx={{
                bgcolor: isDarkMode ? 'rgba(217, 118, 74, 0.1)' : 'rgba(43, 90, 158, 0.04)',
                '&:hover': {
                  bgcolor: isDarkMode ? 'rgba(217, 118, 74, 0.2)' : 'rgba(43, 90, 158, 0.1)'
                },
                width: 40,
                height: 40,
                color: isDarkMode ? '#d9764a' : '#2b5a9e'
              }}
            >
              {open ? <MenuOpenIcon /> : <MenuIcon />}
            </IconButton>
            
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 700,
                background: isDarkMode 
                  ? 'linear-gradient(45deg, #64b5f6 30%, #42a5f5 90%)'
                  : 'linear-gradient(45deg, #2196f3 30%, #1976d2 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              EMS
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Tooltip title="Profile" arrow>
              <IconButton
                onClick={handleProfileMenuOpen}
                sx={{
                  p: 0,
                  bgcolor: isDarkMode ? 'rgba(217, 118, 74, 0.1)' : 'rgba(43, 90, 158, 0.04)',
                  '&:hover': {
                    bgcolor: isDarkMode ? 'rgba(217, 118, 74, 0.2)' : 'rgba(43, 90, 158, 0.1)'
                  },
                  width: 40,
                  height: 40,
                }}
              >
                <Avatar
                  alt={user?.name || 'User'}
                  src={user?.avatar}
                  sx={{ 
                    width: 32, 
                    height: 32,
                    border: `2px solid ${isDarkMode ? '#d9764a' : '#2b5a9e'}`
                  }}
                />
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleProfileMenuClose}
              PaperProps={{
                sx: {
                  mt: 1.5,
                  bgcolor: isDarkMode ? '#1f2937' : '#ffffff',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  borderRadius: '12px',
                  minWidth: 200,
                }
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem onClick={() => {
                handleProfileMenuClose();
                navigate('/profile');
              }}>
                <ListItemIcon>
                  <PersonIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="My Profile" />
              </MenuItem>
              <MenuItem onClick={() => {
                handleProfileMenuClose();
                navigate('/settings');
              }}>
                <ListItemIcon>
                  <SettingsIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Settings" />
              </MenuItem>
            </Menu>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <IconButton
                onClick={handleThemeChange}
                sx={{
                  bgcolor: isDarkMode ? 'rgba(217, 118, 74, 0.1)' : 'rgba(43, 90, 158, 0.04)',
                  '&:hover': {
                    bgcolor: isDarkMode ? 'rgba(217, 118, 74, 0.2)' : 'rgba(43, 90, 158, 0.1)'
                  },
                  width: 40,
                  height: 40,
                  color: isDarkMode ? '#d9764a' : '#2b5a9e'
                }}
              >
                {isDarkMode ? <DarkModeIcon /> : <LightModeIcon />}
              </IconButton>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="contained"
                onClick={handleLogout}
                startIcon={<LogoutIcon />}
                sx={{
                  bgcolor: '#d9764a',
                  '&:hover': {
                    bgcolor: '#de7527',
                  },
                  borderRadius: '12px',
                  px: 3,
                  py: 1,
                  textTransform: 'none',
                  fontWeight: 500,
                  boxShadow: 'none',
                  ml: 1
                }}
              >
                Logout
              </Button>
            </motion.div>
          </Box>
        </Toolbar>
      </AppBarStyled>
      <StyledDrawer
        variant={isMobile ? 'temporary' : 'persistent'}
        anchor="left"
        open={open}
        onClose={handleDrawerClose}
      >
        <DrawerHeader collapsed={!open}>
          <LogoContainer collapsed={!open}>
            <Logo collapsed={!open}>Signavox EMS</Logo>
          </LogoContainer>
          {/* <IconButton onClick={handleDrawerClose} sx={{ display: open ? 'flex' : 'none' }}>
            <ChevronLeftIcon />
          </IconButton> */}
        </DrawerHeader>
        <Divider sx={{ mb: 2 }} />
        <List sx={{
          px: 2,
          '& .MuiListItem-root': {
            transition: 'all 0.2s ease',
            py: 1.5,
            mb: 1.5,
          }
        }}>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <motion.div
                key={item.text}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {open ? (
                  <StyledListItemButton
                    selected={isActive}
                    onClick={() => {
                      navigate(item.path);
                      if (isMobile) handleDrawerClose();
                    }}
                  >
                    <StyledListItemIcon>{item.icon}</StyledListItemIcon>
                    <ListItemText 
                      primary={item.text} 
                      sx={{
                        '& .MuiTypography-root': {
                          fontWeight: isActive ? 600 : 500,
                          color: isActive
                            ? (isDarkMode ? '#d9764a' : '#2b5a9e')
                            : (isDarkMode ? '#d1d5db' : '#374151'),
                          fontSize: '1rem',
                          letterSpacing: '0.02em'
                        }
                      }}
                    />
                    {isActive && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.2 }}
                        style={{
                          position: 'absolute',
                          right: 16,
                          width: 6,
                          height: 6,
                          borderRadius: '50%',
                          backgroundColor: isDarkMode ? '#d9764a' : '#2b5a9e'
                        }}
                      />
                    )}
                  </StyledListItemButton>
                ) : (
                  <Tooltip title={item.text} placement="right" arrow>
                    <StyledListItemButton
                      selected={isActive}
                      onClick={() => {
                        navigate(item.path);
                        if (isMobile) handleDrawerClose();
                      }}
                      collapsed={true}
                    >
                      <StyledListItemIcon collapsed={true}>{item.icon}</StyledListItemIcon>
                    </StyledListItemButton>
                  </Tooltip>
                )}
              </motion.div>
            );
          })}
        </List>
      </StyledDrawer>

      {/* main content */}
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{
          duration: 0.3,
          ease: "easeInOut"
        }}
        sx={{
          flexGrow: 1,
          p: 3,
          mt: '80px',
          ml: open ? '1px' : '0px',
          transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          bgcolor: 'transparent',
          position: 'relative',
          width: `calc(100% - ${open ? drawerWidth : collapsedDrawerWidth}px)`,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `radial-gradient(circle at 50% 50%, ${isDarkMode ? 'rgba(25, 118, 210, 0.1)' : 'rgba(25, 118, 210, 0.05)'}, transparent)`,
            opacity: 0.5,
            pointerEvents: 'none',
          }
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{
            duration: 0.4,
            ease: [0.4, 0, 0.2, 1]
          }}
          style={{
            position: 'relative',
            zIndex: 1
          }}
        >
          <Outlet />
        </motion.div>
      </Box>
    </Box>
  );
};

export default Layout; 
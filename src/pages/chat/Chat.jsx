import React, { useState, useEffect, useRef, useContext } from 'react';
import { useSelector } from 'react-redux';
import { ThemeContext } from '../../theme/ThemeProvider';
import axios from 'axios';
import API from '../../API';
import Swal from 'sweetalert2';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Chip,
  IconButton,
  Grid,
  Tabs,
  Tab,
  Badge,
  Menu,
  MenuItem,
  Tooltip,
  CircularProgress,
  Fade,
  Zoom,
  useTheme,
  alpha,
  InputAdornment,
  Card,
  CardContent,
  Drawer,
  AppBar,
  Toolbar,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import {
  Send as SendIcon,
  Menu as MenuIcon,
  Group as GroupIcon,
  Person as PersonIcon,
  EmojiEmotions as EmojiIcon,
  AttachFile as AttachFileIcon,
  Image as ImageIcon,
  MoreVert as MoreVertIcon,
  Search as SearchIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  ArrowBack as ArrowBackIcon,
  Message as MessageIcon,
  Forum as ForumIcon,
  Work as WorkIcon,
  Code as CodeIcon,
  Storage as StorageIcon,
  People as PeopleIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  Info as InfoIcon,
  Mic as MicIcon,
  InsertDriveFile as FileIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';

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

const MessageBubble = styled(Box)(({ theme, isCurrentUser, isDarkMode }) => ({
  // maxWidth: '',
  padding: '10px 16px',
  borderRadius: isCurrentUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
  marginBottom: 8,
  position: 'relative',
  wordBreak: 'break-word',
  backgroundColor: isCurrentUser
    ? (isDarkMode ? theme.palette.primary.dark : theme.palette.primary.main)
    : (isDarkMode ? alpha('#fff', 0.05) : alpha('#000', 0.05)),
  color: isCurrentUser
    ? '#fff'
    : (isDarkMode ? '#e0e0e0' : theme.palette.text.primary),
  alignSelf: isCurrentUser ? 'flex-end' : 'flex-start',
  boxShadow: isCurrentUser
    ? (isDarkMode ? '0 2px 8px rgba(0, 0, 0, 0.4)' : '0 2px 8px rgba(0, 0, 0, 0.1)')
    : (isDarkMode ? '0 2px 8px rgba(0, 0, 0, 0.2)' : '0 2px 4px rgba(0, 0, 0, 0.05)'),
  '&:hover': {
    backgroundColor: isCurrentUser
      ? (isDarkMode ? theme.palette.primary.dark : theme.palette.primary.dark)
      : (isDarkMode ? alpha('#fff', 0.08) : alpha('#000', 0.08)),
  },
}));

const GroupTab = styled(Tab)(({ theme, isDarkMode, selected }) => ({
  minHeight: 72,
  textTransform: 'none',
  borderRadius: 8,
  margin: '4px 0',
  opacity: selected ? 1 : 0.7,
  transition: 'all 0.3s ease',
  color: isDarkMode ? '#e0e0e0' : theme.palette.text.primary,
  '&.Mui-selected': {
    backgroundColor: isDarkMode ? alpha(theme.palette.primary.main, 0.15) : alpha(theme.palette.primary.main, 0.1),
    color: theme.palette.primary.main,
    fontWeight: 600,
  },
  '&:hover': {
    backgroundColor: isDarkMode ? alpha('#fff', 0.05) : alpha('#000', 0.05),
    opacity: 1,
  },
}));

const StyledBadge = styled(Badge)(({ theme }) => ({
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

const Chat = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const theme = useTheme();
  const user = useSelector((state) => state.auth.user);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [activeGroup, setActiveGroup] = useState('All');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [directMessages, setDirectMessages] = useState([]);
  const [viewMode, setViewMode] = useState('group'); // 'group' or 'direct'

  const groups = [
    { id: 'All', name: 'All Employees', icon: <PeopleIcon />, color: '#3f51b5' },
    { id: 'HR', name: 'HR Team', icon: <WorkIcon />, color: '#f44336' },
    { id: 'Developer', name: 'Developers', icon: <CodeIcon />, color: '#4caf50' },
    { id: 'DevOps', name: 'DevOps Team', icon: <StorageIcon />, color: '#ff9800' },
  ];

  // Fetch group messages
  const fetchGroupMessages = async (groupType) => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await axios.get(`${API}/chats/group/${groupType}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Reverse the messages to show latest at the bottom
      setMessages((response.data.messages || []).reverse());
    } catch (error) {
      console.error('Error fetching group messages:', error);
      setError(error.response?.data?.message || 'Failed to load messages');

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Failed to load messages',
        background: isDarkMode ? '#1a2035' : '#ffffff',
        color: isDarkMode ? '#ffffff' : '#000000',
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Fetch users for direct messaging
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }

      // This endpoint would need to be implemented on your backend
      const response = await axios.get(`${API}/users`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setUsers(response.data.users || []);
    } catch (error) {
      console.error('Error fetching users:', error);

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to load users',
        background: isDarkMode ? '#1a2035' : '#ffffff',
        color: isDarkMode ? '#ffffff' : '#000000',
      });
    }
  };

  // Fetch direct messages with a specific user
  const fetchDirectMessages = async (userId) => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }

      // This endpoint would need to be implemented on your backend
      const response = await axios.get(`${API}/chats/direct/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Reverse the messages to show latest at the bottom
      setDirectMessages((response.data.messages || []).reverse());
    } catch (error) {
      console.error('Error fetching direct messages:', error);
      setError(error.response?.data?.message || 'Failed to load messages');

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to load direct messages',
        background: isDarkMode ? '#1a2035' : '#ffffff',
        color: isDarkMode ? '#ffffff' : '#000000',
      });
    } finally {
      setLoading(false);
    }
  };

  // Send a message
  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }

      let payload;

      if (viewMode === 'group') {
        // Group message
        payload = {
          message: newMessage,
          groupType: activeGroup,
          type: 'text'
        };
      } else {
        // Direct message
        if (!selectedUser) {
          throw new Error('No recipient selected');
        }

        payload = {
          message: newMessage,
          receiverId: selectedUser._id,
          type: 'text'
        };
      }

      const response = await axios.post(`${API}/chats`, payload, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });

      // Update messages list
      if (viewMode === 'group') {
        setMessages(prevMessages => [...prevMessages, response.data.chat]);
      } else {
        setDirectMessages(prevMessages => [...prevMessages, response.data.chat]);
      }

      // Clear input
      setNewMessage('');

      // Show success notification
      Swal.fire({
        icon: 'success',
        title: 'Message Sent',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        background: isDarkMode ? '#1a2035' : '#ffffff',
        color: isDarkMode ? '#ffffff' : '#000000',
      });
    } catch (error) {
      console.error('Error sending message:', error);

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Failed to send message',
        background: isDarkMode ? '#1a2035' : '#ffffff',
        color: isDarkMode ? '#ffffff' : '#000000',
      });
    }
  };

  // Delete a message
  const deleteMessage = async (messageId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }

      await axios.delete(`${API}/chats/${messageId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Update messages list
      if (viewMode === 'group') {
        setMessages(prevMessages => prevMessages.filter(msg => msg._id !== messageId));
      } else {
        setDirectMessages(prevMessages => prevMessages.filter(msg => msg._id !== messageId));
      }

      // Close menu
      handleMenuClose();

      // Show success notification
      Swal.fire({
        icon: 'success',
        title: 'Message Deleted',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        background: isDarkMode ? '#1a2035' : '#ffffff',
        color: isDarkMode ? '#ffffff' : '#000000',
      });
    } catch (error) {
      console.error('Error deleting message:', error);

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Failed to delete message',
        background: isDarkMode ? '#1a2035' : '#ffffff',
        color: isDarkMode ? '#ffffff' : '#000000',
      });
    }
  };

  // Handle menu open
  const handleMenuOpen = (event, message) => {
    setAnchorEl(event.currentTarget);
    setSelectedMessage(message);
  };

  // Handle menu close
  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedMessage(null);
  };

  // Handle group change
  const handleGroupChange = (groupId) => {
    setActiveGroup(groupId);
    fetchGroupMessages(groupId);
    setMobileOpen(false);
  };

  // Handle user selection for direct messaging
  const handleUserSelect = (user) => {
    setSelectedUser(user);
    fetchDirectMessages(user._id);
    setViewMode('direct');
    setMobileOpen(false);
  };

  // Handle view mode change
  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    if (mode === 'group') {
      fetchGroupMessages(activeGroup);
    }
    setMobileOpen(false);
  };

  // Handle refresh
  const handleRefresh = () => {
    setRefreshing(true);
    if (viewMode === 'group') {
      fetchGroupMessages(activeGroup);
    } else if (selectedUser) {
      fetchDirectMessages(selectedUser._id);
    }
  };

  // Handle message submit
  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage();
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    // Use setTimeout to ensure scrolling happens after render
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }, [messages, directMessages]);

  // Fetch initial data
  useEffect(() => {
    fetchGroupMessages(activeGroup);
    fetchUsers();
  }, []);

  // Get current messages based on view mode
  const currentMessages = viewMode === 'group' ? messages : directMessages;

  // Drawer toggle handler
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Drawer content
  const drawerContent = (
    <Box sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, display: 'flex', alignItems: 'center' }}>
        <ForumIcon sx={{ mr: 1 }} />
        Signavox Chat
      </Typography>

      <Divider sx={{ mb: 2 }} />

      <Box sx={{ mb: 2 }}>
        <Button
          fullWidth
          variant={viewMode === 'group' ? 'contained' : 'outlined'}
          startIcon={<GroupIcon />}
          onClick={() => handleViewModeChange('group')}
          sx={{ mb: 1, borderRadius: 2 }}
        >
          Group Chats
        </Button>
        <Button
          fullWidth
          variant={viewMode === 'direct' ? 'contained' : 'outlined'}
          startIcon={<PersonIcon />}
          onClick={() => handleViewModeChange('direct')}
          sx={{ borderRadius: 2 }}
        >
          Direct Messages
        </Button>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {viewMode === 'group' ? (
        <>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: 'text.secondary' }}>
            CHANNELS
          </Typography>
          <List sx={{ width: '100%', p: 0 }}>
            {groups.map((group) => (
              <ListItem
                key={group.id}
                disablePadding
                sx={{ mb: 1 }}
              >
                <Button
                  fullWidth
                  onClick={() => handleGroupChange(group.id)}
                  sx={{
                    justifyContent: 'flex-start',
                    px: 2,
                    py: 1.5,
                    borderRadius: 2,
                    backgroundColor: activeGroup === group.id
                      ? (isDarkMode ? alpha(group.color, 0.15) : alpha(group.color, 0.1))
                      : 'transparent',
                    color: activeGroup === group.id
                      ? group.color
                      : 'text.primary',
                    '&:hover': {
                      backgroundColor: isDarkMode
                        ? alpha(group.color, 0.1)
                        : alpha(group.color, 0.05)
                    }
                  }}
                >
                  <Avatar
                    sx={{
                      mr: 2,
                      bgcolor: alpha(group.color, 0.8),
                      color: '#fff',
                      width: 32,
                      height: 32
                    }}
                  >
                    {group.icon}
                  </Avatar>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <Typography variant="body1" sx={{ fontWeight: activeGroup === group.id ? 600 : 400 }}>
                      {group.name}
                    </Typography>
                  </Box>
                </Button>
              </ListItem>
            ))}
          </List>
        </>
      ) : (
        <>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: 'text.secondary' }}>
            DIRECT MESSAGES
          </Typography>
          <TextField
            fullWidth
            placeholder="Search users..."
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
              sx: { borderRadius: 2 }
            }}
            sx={{ mb: 2 }}
          />
          <List sx={{ width: '100%', p: 0, overflowY: 'auto', flex: 1 }}>
            {users.map((user) => (
              <ListItem
                key={user._id}
                disablePadding
                sx={{ mb: 1 }}
              >
                <Button
                  fullWidth
                  onClick={() => handleUserSelect(user)}
                  sx={{
                    justifyContent: 'flex-start',
                    px: 2,
                    py: 1.5,
                    borderRadius: 2,
                    backgroundColor: selectedUser?._id === user._id
                      ? (isDarkMode ? alpha(theme.palette.primary.main, 0.15) : alpha(theme.palette.primary.main, 0.1))
                      : 'transparent',
                    color: selectedUser?._id === user._id
                      ? theme.palette.primary.main
                      : 'text.primary',
                    '&:hover': {
                      backgroundColor: isDarkMode
                        ? alpha(theme.palette.primary.main, 0.1)
                        : alpha(theme.palette.primary.main, 0.05)
                    }
                  }}
                >
                  <StyledBadge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    variant="dot"
                    sx={{ mr: 2 }}
                  >
                    <Avatar
                      sx={{ width: 32, height: 32 }}
                      alt={user.name}
                      src={user.avatar}
                    >
                      {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </Avatar>
                  </StyledBadge>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <Typography variant="body1" sx={{ fontWeight: selectedUser?._id === user._id ? 600 : 400 }}>
                      {user.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {user.isOnline ? 'Online' : 'Offline'}
                    </Typography>
                  </Box>
                </Button>
              </ListItem>
            ))}
          </List>
        </>
      )}
    </Box>
  );

  return (
    <Box sx={{ height: 'calc(100vh - 200px)', display: 'flex', flexDirection: 'column' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
      >
        <StyledPaper
          elevation={0}
          isDarkMode={isDarkMode}
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Mobile app bar */}
          <AppBar
            position="static"
            color="transparent"
            elevation={0}
            sx={{
              display: { xs: 'block', md: 'none' },
              borderBottom: 1,
              borderColor: 'divider'
            }}
          >
            <Toolbar>
              <IconButton
                color="inherit"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                {viewMode === 'group'
                  ? groups.find(g => g.id === activeGroup)?.name
                  : selectedUser?.name || 'Select a user'}
              </Typography>
              <IconButton color="inherit" onClick={handleRefresh}>
                <RefreshIcon />
              </IconButton>
            </Toolbar>
          </AppBar>

          {/* Main content */}
          <Box sx={{ 
            display: 'flex', 
            height: '600px', // Fixed height for chat container
            overflow: 'auto',
            '&::-webkit-scrollbar': {
              width: '8px',
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-track': {
              background: isDarkMode ? alpha('#fff', 0.05) : alpha('#000', 0.05),
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: isDarkMode ? alpha('#fff', 0.2) : alpha('#000', 0.2),
              borderRadius: '4px',
              '&:hover': {
                background: isDarkMode ? alpha('#fff', 0.3) : alpha('#000', 0.3),
              },
            },
            scrollbarWidth: 'thin',
            scrollbarColor: isDarkMode 
              ? `${alpha('#fff', 0.2)} ${alpha('#fff', 0.05)}`
              : `${alpha('#000', 0.2)} ${alpha('#000', 0.05)}`,
          }}>
            {/* Sidebar - desktop */}
            <Box
              sx={{
                width: 280,
                flexShrink: 0,
                display: { xs: 'none', md: 'block' },
                borderRight: 1,
                borderColor: 'divider',
                overflow: 'auto'
              }}
            >
              {drawerContent}
            </Box>

            {/* Sidebar - mobile */}
            <Drawer
              variant="temporary"
              open={mobileOpen}
              onClose={handleDrawerToggle}
              ModalProps={{
                keepMounted: true, // Better open performance on mobile
              }}
              sx={{
                display: { xs: 'block', md: 'none' },
                '& .MuiDrawer-paper': {
                  boxSizing: 'border-box',
                  width: 280,
                  backgroundColor: isDarkMode ? '#1a2035' : '#ffffff'
                },
              }}
            >
              {drawerContent}
            </Drawer>

            {/* Chat area */}
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              {/* Chat header */}
              <Box
                sx={{
                  p: 2,
                  display: { xs: 'none', md: 'flex' },
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: 1,
                  borderColor: 'divider'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {viewMode === 'group' ? (
                    <>
                      <Avatar
                        sx={{
                          bgcolor: alpha(groups.find(g => g.id === activeGroup)?.color || '#3f51b5', 0.8),
                          mr: 2
                        }}
                      >
                        {groups.find(g => g.id === activeGroup)?.icon}
                      </Avatar>
                      <Typography variant="h6">
                        {groups.find(g => g.id === activeGroup)?.name}
                      </Typography>
                    </>
                  ) : (
                    <>
                      <StyledBadge
                        overlap="circular"
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        variant="dot"
                        sx={{ mr: 2 }}
                      >
                        <Avatar alt={selectedUser?.name} src={selectedUser?.avatar}>
                          {selectedUser?.name ? selectedUser.name.charAt(0).toUpperCase() : 'U'}
                        </Avatar>
                      </StyledBadge>
                      <Box>
                        <Typography variant="h6">{selectedUser?.name || 'Select a user'}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {selectedUser?.isOnline ? 'Online' : 'Last seen recently'}
                        </Typography>
                      </Box>
                    </>
                  )}
                </Box>
                <Box>
                  <Tooltip title="Refresh">
                    <IconButton onClick={handleRefresh} disabled={refreshing}>
                      {refreshing ? <CircularProgress size={24} /> : <RefreshIcon />}
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Search">
                    <IconButton>
                      <SearchIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="More options">
                    <IconButton>
                      <MoreVertIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>

              {/* Messages area with custom scrollbar */}
              <Box
                sx={{
                  flex: 1,
                  p: 2,
                  height: '50px', // Fixed height
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  bgcolor: isDarkMode ? alpha('#000', 0.2) : alpha('#f5f5f5', 0.5),
                  '&::-webkit-scrollbar': {
                    width: '8px',
                    borderRadius: '4px',
                  },
                  '&::-webkit-scrollbar-track': {
                    background: isDarkMode ? alpha('#fff', 0.05) : alpha('#000', 0.05),
                    borderRadius: '4px',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    background: isDarkMode ? alpha('#fff', 0.2) : alpha('#000', 0.2),
                    borderRadius: '4px',
                    '&:hover': {
                      background: isDarkMode ? alpha('#fff', 0.3) : alpha('#000', 0.3),
                    },
                  },
                  scrollbarWidth: 'thin',
                  scrollbarColor: isDarkMode 
                    ? `${alpha('#fff', 0.2)} ${alpha('#fff', 0.05)}`
                    : `${alpha('#000', 0.2)} ${alpha('#000', 0.05)}`,
                }}
              >
                {loading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <CircularProgress />
                  </Box>
                ) : error ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <Typography color="error">{error}</Typography>
                  </Box>
                ) : currentMessages.length === 0 ? (
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: '100%',
                      opacity: 0.7
                    }}
                  >
                    <MessageIcon sx={{ fontSize: 64, mb: 2, color: 'text.secondary' }} />
                    <Typography variant="h6" color="text.secondary">No messages yet</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {viewMode === 'group'
                        ? 'Be the first to send a message to this group!'
                        : 'Start a conversation with this user!'}
                    </Typography>
                  </Box>
                ) : (
                  <>
                    {currentMessages.map((message) => {
                      const isCurrentUser = message.sender?._id === user?.id;

                      return (
                        <Zoom in={true} key={message._id} style={{ transformOrigin: isCurrentUser ? 'right' : 'left' }}>
                          <Box
                            sx={{
                              display: 'flex',
                              flexDirection: isCurrentUser ? 'row-reverse' : 'row',
                              mb: 2,
                              width: '100%', // Ensure the container takes full width
                              justifyContent: isCurrentUser ? 'flex-end' : 'flex-start'
                            }}
                          >
                            {!isCurrentUser && (
                              <Avatar
                                sx={{ mr: 1, width: 36, height: 36, alignSelf: 'flex-end' }}
                                alt={message.sender?.name}
                                src={message.sender?.avatar}
                              >
                                {message.sender?.name ? message.sender.name.charAt(0).toUpperCase() : 'U'}
                              </Avatar>
                            )}

                            <Box sx={{
                              maxWidth: { xs: '80%', sm: '70%', md: '60%' }, // Responsive width constraints
                              minWidth: '120px' // Minimum width for very short messages
                            }}>
                              {!isCurrentUser && (
                                <Typography
                                  variant="caption"
                                  sx={{
                                    ml: 1,
                                    mb: 0.5,
                                    display: 'block',
                                    color: 'text.secondary'
                                  }}
                                >
                                  {message.sender?.name}
                                </Typography>
                              )}

                              <MessageBubble
                                isCurrentUser={isCurrentUser}
                                isDarkMode={isDarkMode}
                              >
                                {message.type === 'file' ? (
                                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <FileIcon sx={{ mr: 1 }} />
                                    <Typography variant="body2">
                                      {message.message}
                                    </Typography>
                                  </Box>
                                ) : (
                                  <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                                    {message.message}
                                  </Typography>
                                )}

                                <Box
                                  sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    mt: 1,
                                    opacity: 0.7
                                  }}
                                >
                                  <Typography variant="caption" sx={{
                                    fontSize: '0.7rem',
                                    color: isCurrentUser ? 'rgba(255, 255, 255, 0.8)' : 'inherit'
                                  }}>
                                    {format(new Date(message.createdAt), 'MMM d, h:mm a')}
                                  </Typography>

                                  {isCurrentUser && (
                                    <IconButton
                                      size="small"
                                      onClick={(e) => handleMenuOpen(e, message)}
                                      sx={{
                                        p: 0.5,
                                        ml: 1,
                                        color: 'inherit',
                                        '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
                                      }}
                                    >
                                      <MoreVertIcon fontSize="small" />
                                    </IconButton>
                                  )}
                                </Box>
                              </MessageBubble>
                            </Box>

                            {isCurrentUser && (
                              <Avatar
                                sx={{ ml: 1, width: 36, height: 36, alignSelf: 'flex-end' }}
                                alt={user?.name}
                                src={user?.avatar}
                              >
                                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                              </Avatar>
                            )}
                          </Box>
                        </Zoom>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </Box>

              {/* Message input area */}
              <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                  p: 2,
                  borderTop: 1,
                  borderColor: 'divider',
                  backgroundColor: isDarkMode ? alpha('#111827', 0.4) : '#fff'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <IconButton color="primary" sx={{ mr: 1 }}>
                    <AttachFileIcon />
                  </IconButton>
                  <IconButton color="primary" sx={{ mr: 1 }}>
                    <EmojiIcon />
                  </IconButton>
                  <TextField
                    fullWidth
                    placeholder={`Type a message to ${viewMode === 'group' ? activeGroup : selectedUser?.name || 'recipient'}...`}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    variant="outlined"
                    size="small"
                    InputProps={{
                      sx: {
                        borderRadius: 4,
                        backgroundColor: isDarkMode ? alpha('#000', 0.2) : alpha('#f5f5f5', 0.7)
                      },
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton color="primary">
                            <MicIcon />
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                    sx={{ mr: 1 }}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    endIcon={<SendIcon />}
                    disabled={!newMessage.trim() || (viewMode === 'direct' && !selectedUser)}
                    type="submit"
                    sx={{
                      borderRadius: 4,
                      px: 3,
                      background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                      boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
                    }}
                  >
                    Send
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>
        </StyledPaper>
      </motion.div>

      {/* Message options menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
            borderRadius: 2,
            minWidth: 150
          }
        }}
      >
        <MenuItem
          onClick={() => {
            if (selectedMessage) {
              deleteMessage(selectedMessage._id);
            }
          }}
          sx={{
            color: '#ef4444',
            '&:hover': {
              backgroundColor: isDarkMode ? alpha('#ef4444', 0.1) : alpha('#ef4444', 0.05)
            }
          }}
        >
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default Chat;
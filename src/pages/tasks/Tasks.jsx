import React, { useState, useEffect, useContext } from 'react';
import { useSelector } from 'react-redux';
import { ThemeContext } from '../../theme/ThemeProvider';
import {
  Box,
  Paper,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Avatar,
  Tooltip,
  Badge,
  Divider,
  CircularProgress,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Collapse,
  Fade,
  Zoom,
  Skeleton,
  OutlinedInput,
  InputAdornment,
  useTheme,
  alpha,
  Tabs,
  Tab,
  Autocomplete
} from '@mui/material';
import axios from 'axios';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Assignment as AssignmentIcon,
  AccessTime as AccessTimeIcon,
  Flag as FlagIcon,
  Person as PersonIcon,
  Category as CategoryIcon,
  Description as DescriptionIcon,
  Feedback as FeedbackIcon,
  AttachFile as AttachFileIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Sort as SortIcon,
  Refresh as RefreshIcon,
  MoreVert as MoreVertIcon,
  Close as CloseIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  PriorityHigh as PriorityHighIcon,
  LowPriority as LowPriorityIcon,
  HourglassEmpty as PendingIcon,
  DirectionsRun as InProgressIcon,
  Done as CompletedIcon,
  Block as CancelledIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import API from '../../API';
import { format } from 'date-fns';

// Styled components
const StyledCard = styled(Card)(({ theme, priority, isDarkMode }) => {
  const getPriorityColor = () => {
    switch (priority) {
      case 'high':
        return isDarkMode ? '#ef4444' : '#ef4444';
      case 'medium':
        return isDarkMode ? '#f59e0b' : '#f59e0b';
      case 'low':
        return isDarkMode ? '#10b981' : '#10b981';
      default:
        return isDarkMode ? '#6b7280' : '#6b7280';
    }
  };

  return {
    position: 'relative',
    overflow: 'visible',
    transition: 'transform 0.3s, box-shadow 0.3s',
    borderRadius: '12px',
    boxShadow: `0 4px 12px ${alpha(theme.palette.mode === 'dark' ? '#000' : '#6366f1', 0.1)}`,
    border: `1px solid ${theme.palette.mode === 'dark' ? alpha('#fff', 0.1) : alpha('#000', 0.05)}`,
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: `0 8px 24px ${alpha(theme.palette.mode === 'dark' ? '#000' : '#6366f1', 0.15)}`,
    },
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '4px',
      height: '100%',
      backgroundColor: getPriorityColor(),
      borderRadius: '12px 0 0 12px',
    }
  };
});

const StatusChip = styled(Chip)(({ theme, status, isDarkMode }) => {
  const getStatusStyles = () => {
    switch (status) {
      case 'completed':
        return {
          bgcolor: isDarkMode ? alpha('#10b981', 0.2) : alpha('#10b981', 0.1),
          color: isDarkMode ? '#34d399' : '#059669',
          borderColor: isDarkMode ? alpha('#10b981', 0.3) : alpha('#10b981', 0.2)
        };
      case 'in-progress':
        return {
          bgcolor: isDarkMode ? alpha('#f59e0b', 0.2) : alpha('#f59e0b', 0.1),
          color: isDarkMode ? '#fbbf24' : '#d97706',
          borderColor: isDarkMode ? alpha('#f59e0b', 0.3) : alpha('#f59e0b', 0.2)
        };
      case 'cancelled':
        return {
          bgcolor: isDarkMode ? alpha('#6b7280', 0.2) : alpha('#6b7280', 0.1),
          color: isDarkMode ? '#9ca3af' : '#4b5563',
          borderColor: isDarkMode ? alpha('#6b7280', 0.3) : alpha('#6b7280', 0.2)
        };
      case 'pending':
      default:
        return {
          bgcolor: isDarkMode ? alpha('#ef4444', 0.2) : alpha('#ef4444', 0.1),
          color: isDarkMode ? '#f87171' : '#dc2626',
          borderColor: isDarkMode ? alpha('#ef4444', 0.3) : alpha('#ef4444', 0.2)
        };
    }
  };

  const styles = getStatusStyles();

  return {
    fontWeight: 600,
    borderRadius: '8px',
    border: `1px solid ${styles.borderColor}`,
    backgroundColor: styles.bgcolor,
    color: styles.color,
    '& .MuiChip-icon': {
      color: styles.color
    }
  };
});

const PriorityChip = styled(Chip)(({ theme, priority, isDarkMode }) => {
  const getPriorityStyles = () => {
    switch (priority) {
      case 'high':
        return {
          bgcolor: isDarkMode ? alpha('#ef4444', 0.2) : alpha('#ef4444', 0.1),
          color: isDarkMode ? '#f87171' : '#dc2626',
          borderColor: isDarkMode ? alpha('#ef4444', 0.3) : alpha('#ef4444', 0.2)
        };
      case 'medium':
        return {
          bgcolor: isDarkMode ? alpha('#f59e0b', 0.2) : alpha('#f59e0b', 0.1),
          color: isDarkMode ? '#fbbf24' : '#d97706',
          borderColor: isDarkMode ? alpha('#f59e0b', 0.3) : alpha('#f59e0b', 0.2)
        };
      case 'low':
        return {
          bgcolor: isDarkMode ? alpha('#10b981', 0.2) : alpha('#10b981', 0.1),
          color: isDarkMode ? '#34d399' : '#059669',
          borderColor: isDarkMode ? alpha('#10b981', 0.3) : alpha('#10b981', 0.2)
        };
      default:
        return {
          bgcolor: isDarkMode ? alpha('#6b7280', 0.2) : alpha('#6b7280', 0.1),
          color: isDarkMode ? '#9ca3af' : '#4b5563',
          borderColor: isDarkMode ? alpha('#6b7280', 0.3) : alpha('#6b7280', 0.2)
        };
    }
  };

  const styles = getPriorityStyles();

  return {
    fontWeight: 600,
    borderRadius: '8px',
    border: `1px solid ${styles.borderColor}`,
    backgroundColor: styles.bgcolor,
    color: styles.color,
    '& .MuiChip-icon': {
      color: styles.color
    }
  };
});

const CategoryChip = styled(Chip)(({ theme, isDarkMode }) => ({
  fontWeight: 500,
  borderRadius: '8px',
  backgroundColor: isDarkMode ? alpha('#8b5cf6', 0.2) : alpha('#8b5cf6', 0.1),
  color: isDarkMode ? '#a78bfa' : '#7c3aed',
  border: `1px solid ${isDarkMode ? alpha('#8b5cf6', 0.3) : alpha('#8b5cf6', 0.2)}`,
  '& .MuiChip-icon': {
    color: isDarkMode ? '#a78bfa' : '#7c3aed'
  }
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme, isDarkMode }) => ({
  background: isDarkMode
    ? 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)'
    : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
  color: '#ffffff',
  padding: '16px 24px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderBottom: isDarkMode ? '1px solid #374151' : '1px solid rgba(255, 255, 255, 0.2)',
  '& .MuiTypography-root': {
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  }
}));

const Tasks = () => {
  const user = useSelector((state) => state.auth.user);
  const { isDarkMode } = useContext(ThemeContext);
  const theme = useTheme();
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [expandedTaskId, setExpandedTaskId] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    assignedTo: '',
    dueDate: '',
    status: 'pending',
    priority: 'medium',
    category: '',
    feedback: ''
  });

  // Get CEO permission from localStorage
  const isCEO = localStorage.getItem('role') === 'CEO';
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchTasks();
    if (isCEO) {
      fetchUsers();
    }
  }, [isCEO]);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API}/tasks`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }

      const data = await response.json();
      setTasks(data.tasks || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `Failed to load tasks: ${error.message}`,
        toast: true,
        position: 'bottom-end',
        showConfirmButton: false,
        timer: 5000,
        timerProgressBar: true,
        background: isDarkMode ? '#1f2937' : '#fee2e2',
        iconColor: '#ef4444'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API}/users`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `Failed to load users: ${error.message}`,
        toast: true,
        position: 'bottom-end',
        showConfirmButton: false,
        timer: 5000,
        timerProgressBar: true,
        background: isDarkMode ? '#1f2937' : '#fee2e2',
        iconColor: '#ef4444'
      });
    }
  };

  const handleOpenDialog = () => {
    setSelectedTask(null);
    setNewTask({
      title: '',
      description: '',
      assignedTo: '',
      dueDate: format(new Date(), 'yyyy-MM-dd'),
      status: 'pending',
      priority: 'medium',
      category: '',
      feedback: ''
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedTask(null);
  };

  const handleSaveTask = async () => {
    try {
      Swal.fire({
        title: 'Processing...',
        text: selectedTask ? 'Updating task' : 'Creating new task',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
        background: isDarkMode ? '#1f2937' : '#ffffff',
      });

      const taskData = {
        title: newTask.title,
        description: newTask.description,
        dueDate: new Date(newTask.dueDate),
        priority: newTask.priority,
        status: newTask.status,
        assignedTo: newTask.assignedTo,
        category: newTask.category,
        feedback: newTask.feedback
      };

      let response;

      if (selectedTask) {
        // Update existing task
        response = await fetch(`${API}/tasks/${selectedTask._id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(taskData)
        });
      } else {
        // Create new task
        response = await fetch(`${API}/tasks`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(taskData)
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save task');
      }

      const data = await response.json();

      Swal.fire({
        icon: 'success',
        title: selectedTask ? 'Task Updated' : 'Task Created',
        text: selectedTask ? 'The task has been updated successfully.' : 'A new task has been created successfully.',
        toast: true,
        position: 'bottom-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        background: isDarkMode ? '#1f2937' : '#f0fdf4',
        iconColor: '#10b981'
      });

      // Refresh tasks
      fetchTasks();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving task:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Failed to save task',
        background: isDarkMode ? '#1f2937' : '#ffffff',
        confirmButtonColor: theme.palette.primary.main
      });
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Yes, delete it!',
        background: isDarkMode ? '#1f2937' : '#ffffff',
      });

      if (result.isConfirmed) {
        Swal.fire({
          title: 'Deleting...',
          text: 'Please wait while we delete the task',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
          background: isDarkMode ? '#1f2937' : '#ffffff',
        });

        const response = await fetch(`${API}/tasks/${taskId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to delete task');
        }

        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'The task has been deleted.',
          toast: true,
          position: 'bottom-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          background: isDarkMode ? '#1f2937' : '#f0fdf4',
          iconColor: '#10b981'
        });

        // Refresh tasks
        fetchTasks();
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Failed to delete task',
        background: isDarkMode ? '#1f2937' : '#ffffff',
        confirmButtonColor: theme.palette.primary.main
      });
    }
  };

  // ... existing code ...

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      // Find the current task data
      const taskToUpdate = tasks.find(task => task._id === taskId);
      if (!taskToUpdate) {
        throw new Error('Task not found');
      }

      // Get token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }

      // Prepare the updated task data
      const updatedTaskData = {
        title: taskToUpdate.title,
        description: taskToUpdate.description,
        dueDate: taskToUpdate.dueDate,
        priority: taskToUpdate.priority,
        status: newStatus,
        assignedTo: taskToUpdate.assignedTo._id,
        category: taskToUpdate.category,
        feedback: taskToUpdate.feedback || ''
      };

      // Make API request to update the task
      const response = await axios.put(
        `${API}/tasks/${taskId}`,
        updatedTaskData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      );

      // Update local state with the updated task
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task._id === taskId ? response.data.task : task
        )
      );

      // Show success notification
      Swal.fire({
        icon: 'success',
        title: 'Status Updated',
        text: `Task status changed to ${newStatus.replace('-', ' ')}`,
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        background: isDarkMode ? '#1f2937' : '#ffffff',
        color: isDarkMode ? '#f3f4f6' : '#111827'
      });
    } catch (error) {
      console.error('Error updating task status:', error);

      // Show error notification
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: error.response?.data?.message || 'Failed to update task status',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        background: isDarkMode ? '#1f2937' : '#ffffff',
        color: isDarkMode ? '#f3f4f6' : '#111827'
      });
    }
  };

  // ... existing code ...

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setNewTask({
      title: task.title,
      description: task.description || '',
      assignedTo: task.assignedTo._id || task.assignedTo,
      dueDate: format(new Date(task.dueDate), 'yyyy-MM-dd'),
      status: task.status,
      priority: task.priority,
      category: task.category || '',
      feedback: task.feedback || ''
    });
    setOpenDialog(true);
  };

  const handleExpandTask = (taskId) => {
    setExpandedTaskId(expandedTaskId === taskId ? null : taskId);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CompletedIcon />;
      case 'in-progress':
        return <InProgressIcon />;
      case 'cancelled':
        return <CancelledIcon />;
      case 'pending':
      default:
        return <PendingIcon />;
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high':
        return <PriorityHighIcon />;
      case 'low':
        return <LowPriorityIcon />;
      case 'medium':
      default:
        return <FlagIcon />;
    }
  };

  const filterTasks = () => {
    let filteredTasks = [...tasks];

    // Filter by tab (status groups)
    if (tabValue === 1) {
      filteredTasks = filteredTasks.filter(task => task.status === 'pending');
    } else if (tabValue === 2) {
      filteredTasks = filteredTasks.filter(task => task.status === 'in-progress');
    } else if (tabValue === 3) {
      filteredTasks = filteredTasks.filter(task => task.status === 'completed');
    } else if (tabValue === 4) {
      filteredTasks = filteredTasks.filter(task => task.status === 'cancelled');
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredTasks = filteredTasks.filter(task =>
        task.title.toLowerCase().includes(query) ||
        (task.description && task.description.toLowerCase().includes(query)) ||
        (task.category && task.category.toLowerCase().includes(query)) ||
        (task.assignedTo.name && task.assignedTo.name.toLowerCase().includes(query))
      );
    }

    // Filter by priority
    if (filterPriority !== 'all') {
      filteredTasks = filteredTasks.filter(task => task.priority === filterPriority);
    }

    // Filter by status (if not already filtered by tab)
    if (tabValue === 0 && filterStatus !== 'all') {
      filteredTasks = filteredTasks.filter(task => task.status === filterStatus);
    }

    return filteredTasks;
  };

  const filteredTasks = filterTasks();

  return (
    <Box sx={{
      p: 3,
      backgroundColor: isDarkMode ? alpha('#111827', 0.7) : alpha('#f9fafb', 0.7),
      minHeight: 'calc(100vh - 64px)',
      borderRadius: 2
    }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 3,
            borderRadius: 2,
            background: isDarkMode
              ? 'linear-gradient(135deg, #1f2937 0%, #111827 100%)'
              : 'linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)',
            boxShadow: isDarkMode
              ? '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.15)'
              : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                <AssignmentIcon fontSize="large" color="primary" />
                Task Management
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Organize, track, and manage your team's tasks efficiently
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              {isCEO && (
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleOpenDialog}
                  sx={{
                    borderRadius: 2,
                    px: 3,
                    py: 1,
                    background: 'linear-gradient(45deg, #4f46e5, #6366f1)',
                    boxShadow: '0 4px 10px rgba(79, 70, 229, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #4338ca, #4f46e5)',
                      boxShadow: '0 6px 15px rgba(79, 70, 229, 0.4)',
                    }
                  }}
                >
                  Create Task
                </Button>
              )}
              <Tooltip title="Refresh Tasks">
                <IconButton
                  onClick={fetchTasks}
                  sx={{
                    backgroundColor: isDarkMode ? alpha('#fff', 0.05) : alpha('#000', 0.05),
                    '&:hover': {
                      backgroundColor: isDarkMode ? alpha('#fff', 0.1) : alpha('#000', 0.1),
                    }
                  }}
                >
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Paper>

        <Box sx={{ mb: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search tasks by title, description, category or assignee..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                  sx: {
                    borderRadius: 2,
                    backgroundColor: isDarkMode ? alpha('#1f2937', 0.7) : alpha('#fff', 0.9),
                  }
                }}
                variant="outlined"
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={6} md={3}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Priority Filter</InputLabel>
                <Select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  label="Priority Filter"
                  sx={{
                    borderRadius: 2,
                    backgroundColor: isDarkMode ? alpha('#1f2937', 0.7) : alpha('#fff', 0.9),
                  }}
                >
                  <MenuItem value="all">All Priorities</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="low">Low</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} md={3}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Status Filter</InputLabel>
                <Select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  label="Status Filter"
                  disabled={tabValue !== 0}
                  sx={{
                    borderRadius: 2,
                    backgroundColor: isDarkMode ? alpha('#1f2937', 0.7) : alpha('#fff', 0.9),
                  }}
                >
                  <MenuItem value="all">All Statuses</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="in-progress">In Progress</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>

        <Paper
          elevation={0}
          sx={{
            borderRadius: 2,
            overflow: 'hidden',
            backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
            boxShadow: isDarkMode
              ? '0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.1)'
              : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
          }}
        >
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
              '& .MuiTab-root': {
                minHeight: '64px',
                fontWeight: 600
              },
              '& .Mui-selected': {
                color: theme.palette.primary.main
              },
              '& .MuiTabs-indicator': {
                backgroundColor: theme.palette.primary.main,
                height: 3
              }
            }}
          >
            <Tab
              label="All Tasks"
              icon={<AssignmentIcon />}
              iconPosition="start"
              sx={{ textTransform: 'none' }}
            />
            <Tab
              label="Pending"
              icon={<PendingIcon />}
              iconPosition="start"
              sx={{ textTransform: 'none' }}
            />
            <Tab
              label="In Progress"
              icon={<InProgressIcon />}
              iconPosition="start"
              sx={{ textTransform: 'none' }}
            />
            <Tab
              label="Completed"
              icon={<CompletedIcon />}
              iconPosition="start"
              sx={{ textTransform: 'none' }}
            />
            <Tab
              label="Cancelled"
              icon={<CancelledIcon />}
              iconPosition="start"
              sx={{ textTransform: 'none' }}
            />
          </Tabs>

          {loading ? (
            <Box sx={{ p: 4 }}>
              <Grid container spacing={3}>
                {[1, 2, 3].map((item) => (
                  <Grid item xs={12} md={6} lg={4} key={item}>
                    <Skeleton
                      variant="rectangular"
                      width="100%"
                      height={200}
                      sx={{
                        borderRadius: 2,
                        mb: 1
                      }}
                    />
                    <Skeleton width="70%" height={30} sx={{ mb: 1 }} />
                    <Skeleton width="40%" height={20} />
                  </Grid>
                ))}
              </Grid>
            </Box>
          ) : filteredTasks.length === 0 ? (
            <Box
              sx={{
                p: 6,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'text.secondary'
              }}
            >
              <AssignmentIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
              <Typography variant="h6" gutterBottom>No tasks found</Typography>
              <Typography variant="body2">
                {searchQuery || filterPriority !== 'all' || filterStatus !== 'all'
                  ? 'Try adjusting your filters to see more results'
                  : 'Create a new task to get started'}
              </Typography>
              {isCEO && (
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleOpenDialog}
                  sx={{ mt: 2 }}
                >
                  Create Task
                </Button>
              )}
            </Box>
          ) : (
            <Box sx={{ p: 3 }}>
              <Grid container spacing={3}>
                {filteredTasks.map((task) => (
                  <Grid item xs={12} md={6} lg={4} key={task._id}>
                    <Zoom in={true} style={{ transitionDelay: '100ms' }}>
                      <StyledCard
                        priority={task.priority}
                        isDarkMode={isDarkMode}
                        elevation={1}
                      >
                        <CardHeader
                          title={
                            <Tooltip title={task.title} placement="top">
                              <Typography
                                variant="h6"
                                sx={{
                                  paddingTop: 3,
                                  fontWeight: 600,
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap'
                                }}
                              >
                                {task.title}
                              </Typography>
                            </Tooltip>
                          }
                          action={
                            <Box sx={{
                              display: 'flex',
                              position: 'absolute',
                              top: 8,
                              right: 8,
                              zIndex: 1
                            }}>

                              {isCEO && (
                                <>
                                  <Tooltip title="Edit Task">
                                    <IconButton
                                      size="small"
                                      onClick={() => handleEditTask(task)}
                                      sx={{
                                        color: isDarkMode ? '#d1d5db' : '#4b5563',
                                        '&:hover': {
                                          color: theme.palette.primary.main,
                                          backgroundColor: isDarkMode ? alpha('#fff', 0.05) : alpha('#000', 0.05)
                                        }
                                      }}
                                    >
                                      <EditIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Delete Task">
                                    <IconButton
                                      size="small"
                                      onClick={() => handleDeleteTask(task._id)}
                                      sx={{
                                        color: isDarkMode ? '#d1d5db' : '#4b5563',
                                        '&:hover': {
                                          color: '#ef4444',
                                          backgroundColor: isDarkMode ? alpha('#ef4444', 0.1) : alpha('#ef4444', 0.05)
                                        }
                                      }}
                                    >
                                      <DeleteIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                </>
                              )}
                              <Tooltip title="Expand Details">
                                <IconButton
                                  size="small"
                                  onClick={() => handleExpandTask(task._id)}
                                  sx={{
                                    color: isDarkMode ? '#d1d5db' : '#4b5563',
                                    transform: expandedTaskId === task._id ? 'rotate(180deg)' : 'rotate(0deg)',
                                    transition: 'transform 0.3s',
                                    '&:hover': {
                                      backgroundColor: isDarkMode ? alpha('#fff', 0.05) : alpha('#000', 0.05)
                                    }
                                  }}
                                >
                                  {expandedTaskId === task._id ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
                                </IconButton>
                              </Tooltip>
                            </Box>
                          }
                          subheader={
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                              <AccessTimeIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary', fontSize: 16 }} />
                              <Typography variant="body2" color="text.secondary">
                                Due: {format(new Date(task.dueDate), 'MMM dd, yyyy')}
                              </Typography>
                            </Box>
                          }
                          sx={{ pb: 0 }}
                        />
                        <CardContent sx={{ pt: 1 }}>
                          <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                            <StatusChip
                              label={task.status.replace('-', ' ')}
                              status={task.status}
                              isDarkMode={isDarkMode}
                              size="small"
                              icon={getStatusIcon(task.status)}
                            />
                            <PriorityChip
                              label={task.priority}
                              priority={task.priority}
                              isDarkMode={isDarkMode}
                              size="small"
                              icon={getPriorityIcon(task.priority)}
                            />
                            {task.category && (
                              <CategoryChip
                                label={task.category}
                                isDarkMode={isDarkMode}
                                size="small"
                                icon={<CategoryIcon fontSize="small" />}
                              />
                            )}
                          </Box>

                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <PersonIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                            <Typography variant="body2">
                              Assigned to: {task.assignedTo.name || 'Unknown'}
                            </Typography>
                          </Box>

                          <Collapse in={expandedTaskId === task._id} timeout="auto" unmountOnExit>
                            <Box sx={{ mt: 2 }}>
                              <Divider sx={{ mb: 2 }} />

                              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, display: 'flex', alignItems: 'center' }}>
                                <DescriptionIcon fontSize="small" sx={{ mr: 1 }} />
                                Description
                              </Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 2, whiteSpace: 'pre-line' }}>
                                {task.description || 'No description provided'}
                              </Typography>

                              {task.feedback && (
                                <>
                                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, display: 'flex', alignItems: 'center' }}>
                                    <FeedbackIcon fontSize="small" sx={{ mr: 1 }} />
                                    Feedback
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                    {task.feedback}
                                  </Typography>
                                </>
                              )}

                              {/* Status update section - only shown for active tasks */}
                              {(task.status !== 'completed' &&
                                task.status !== 'cancelled') && (
                                  <Box sx={{ mt: 2 }}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                                      Update Status
                                    </Typography>
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                      {task.status !== 'in-progress' && (
                                        <Button
                                          size="small"
                                          variant="outlined"
                                          startIcon={<InProgressIcon />}
                                          onClick={() => handleStatusChange(task._id, 'in-progress')}
                                          sx={{
                                            borderColor: '#f59e0b',
                                            color: '#f59e0b',
                                            '&:hover': {
                                              borderColor: '#d97706',
                                              backgroundColor: alpha('#f59e0b', 0.1)
                                            }
                                          }}
                                        >
                                          In Progress
                                        </Button>
                                      )}
                                      <Button
                                        size="small"
                                        variant="outlined"
                                        startIcon={<CompletedIcon />}
                                        onClick={() => handleStatusChange(task._id, 'completed')}
                                        sx={{
                                          borderColor: '#10b981',
                                          color: '#10b981',
                                          '&:hover': {
                                            borderColor: '#059669',
                                            backgroundColor: alpha('#10b981', 0.1)
                                          }
                                        }}
                                      >
                                        Complete
                                      </Button>
                                      <Button
                                        size="small"
                                        variant="outlined"
                                        startIcon={<CancelledIcon />}
                                        onClick={() => handleStatusChange(task._id, 'cancelled')}
                                        sx={{
                                          borderColor: '#6b7280',
                                          color: '#6b7280',
                                          '&:hover': {
                                            borderColor: '#4b5563',
                                            backgroundColor: alpha('#6b7280', 0.1)
                                          }
                                        }}
                                      >
                                        Cancel
                                      </Button>
                                    </Box>
                                  </Box>
                                )}
                            </Box>
                          </Collapse>
                        </CardContent>
                      </StyledCard>
                    </Zoom>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </Paper>
      </motion.div>

      {/* Task Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
            backgroundImage: isDarkMode
              ? 'radial-gradient(circle at 100% 100%, #2d3748 0, transparent 25%), radial-gradient(circle at 0% 0%, #2d3748 0, transparent 25%)'
              : 'radial-gradient(circle at 100% 100%, #eef2ff 0, transparent 25%), radial-gradient(circle at 0% 0%, #eef2ff 0, transparent 25%)',
          }
        }}
      >
        <StyledDialogTitle isDarkMode={isDarkMode}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <AssignmentIcon sx={{ mr: 1 }} />
            {selectedTask ? 'Edit Task' : 'Create New Task'}
          </Box>
          <IconButton
            onClick={handleCloseDialog}
            sx={{
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            <CloseIcon />
          </IconButton>
        </StyledDialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Grid container spacing={3} sx={{ mt: 0 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                required
                InputLabelProps={{
                  sx: { color: isDarkMode ? '#d1d5db' : undefined }
                }}
                InputProps={{
                  sx: {
                    borderRadius: 2,
                    backgroundColor: isDarkMode ? alpha('#111827', 0.4) : undefined
                  }
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={4}
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                InputLabelProps={{
                  sx: { color: isDarkMode ? '#d1d5db' : undefined }
                }}
                InputProps={{
                  sx: {
                    borderRadius: 2,
                    backgroundColor: isDarkMode ? alpha('#111827', 0.4) : undefined
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: isDarkMode ? '#d1d5db' : undefined }}>Assigned To</InputLabel>
                <Select
                  value={newTask.assignedTo}
                  label="Assigned To"
                  onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
                  required
                  sx={{
                    borderRadius: 2,
                    backgroundColor: isDarkMode ? alpha('#111827', 0.4) : undefined
                  }}
                >
                  {users.map((user) => (
                    <MenuItem key={user._id} value={user._id}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar
                          sx={{
                            width: 24,
                            height: 24,
                            mr: 1,
                            bgcolor: `#${Math.floor(Math.random() * 16777215).toString(16)}`
                          }}
                        >
                          {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                        </Avatar>
                        <Typography>{user.name || user.email}</Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Due Date"
                type="date"
                value={newTask.dueDate}
                onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                required
                InputLabelProps={{
                  shrink: true,
                  sx: { color: isDarkMode ? '#d1d5db' : undefined }
                }}
                InputProps={{
                  sx: {
                    borderRadius: 2,
                    backgroundColor: isDarkMode ? alpha('#111827', 0.4) : undefined
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: isDarkMode ? '#d1d5db' : undefined }}>Priority</InputLabel>
                <Select
                  value={newTask.priority}
                  label="Priority"
                  onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                  sx={{
                    borderRadius: 2,
                    backgroundColor: isDarkMode ? alpha('#111827', 0.4) : undefined
                  }}
                >
                  <MenuItem value="high">
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <PriorityHighIcon sx={{ mr: 1, color: '#ef4444' }} />
                      High
                    </Box>
                  </MenuItem>
                  <MenuItem value="medium">
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <FlagIcon sx={{ mr: 1, color: '#f59e0b' }} />
                      Medium
                    </Box>
                  </MenuItem>
                  <MenuItem value="low">
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <LowPriorityIcon sx={{ mr: 1, color: '#10b981' }} />
                      Low
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: isDarkMode ? '#d1d5db' : undefined }}>Status</InputLabel>
                <Select
                  value={newTask.status}
                  label="Status"
                  onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
                  sx={{
                    borderRadius: 2,
                    backgroundColor: isDarkMode ? alpha('#111827', 0.4) : undefined
                  }}
                >
                  <MenuItem value="pending">
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <PendingIcon sx={{ mr: 1, color: '#ef4444' }} />
                      Pending
                    </Box>
                  </MenuItem>
                  <MenuItem value="in-progress">
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <InProgressIcon sx={{ mr: 1, color: '#f59e0b' }} />
                      In Progress
                    </Box>
                  </MenuItem>
                  <MenuItem value="completed">
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CompletedIcon sx={{ mr: 1, color: '#10b981' }} />
                      Completed
                    </Box>
                  </MenuItem>
                  <MenuItem value="cancelled">
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CancelledIcon sx={{ mr: 1, color: '#6b7280' }} />
                      Cancelled
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Category"
                value={newTask.category}
                onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
                required
                InputLabelProps={{
                  sx: { color: isDarkMode ? '#d1d5db' : undefined }
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CategoryIcon sx={{ color: isDarkMode ? '#d1d5db' : undefined }} />
                    </InputAdornment>
                  ),
                  sx: {
                    borderRadius: 2,
                    backgroundColor: isDarkMode ? alpha('#111827', 0.4) : undefined
                  }
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Feedback"
                multiline
                rows={2}
                value={newTask.feedback}
                onChange={(e) => setNewTask({ ...newTask, feedback: e.target.value })}
                InputLabelProps={{
                  sx: { color: isDarkMode ? '#d1d5db' : undefined }
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FeedbackIcon sx={{ color: isDarkMode ? '#d1d5db' : undefined }} />
                    </InputAdornment>
                  ),
                  sx: {
                    borderRadius: 2,
                    backgroundColor: isDarkMode ? alpha('#111827', 0.4) : undefined
                  }
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button
            onClick={handleCloseDialog}
            variant="outlined"
            startIcon={<CancelIcon />}
            sx={{
              borderRadius: 2,
              borderColor: isDarkMode ? '#4b5563' : undefined,
              color: isDarkMode ? '#d1d5db' : undefined,
              '&:hover': {
                borderColor: isDarkMode ? '#6b7280' : undefined,
                backgroundColor: isDarkMode ? alpha('#fff', 0.05) : undefined
              }
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveTask}
            variant="contained"
            startIcon={<SaveIcon />}
            sx={{
              borderRadius: 2,
              background: 'linear-gradient(45deg, #4f46e5, #6366f1)',
              boxShadow: '0 4px 10px rgba(79, 70, 229, 0.3)',
              '&:hover': {
                background: 'linear-gradient(45deg, #4338ca, #4f46e5)',
                boxShadow: '0 6px 15px rgba(79, 70, 229, 0.4)',
              }
            }}
          >
            {selectedTask ? 'Update Task' : 'Create Task'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Tasks;
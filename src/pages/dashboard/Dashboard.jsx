import React, { useContext, useEffect, useState, useRef } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  IconButton,
  Divider,
  LinearProgress,
  Chip,
  useTheme,
  alpha,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemAvatar,
  ListItemText,
  Badge,
  AvatarGroup,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  CircularProgress,
} from '@mui/material';
import {
  TrendingUp,
  People,
  Event,
  Assignment,
  Notifications,
  MoreVert,
  CheckCircle,
  PendingActions,
  Warning,
  CalendarToday,
  AccessTime,
  LocationOn,
  Email,
  Phone,
  LinkedIn,
  Twitter,
  Add as AddIcon,
  Edit as EditIcon,
  Campaign as CampaignIcon,
  Group as GroupIcon,
  Work as WorkIcon,
  Engineering as EngineeringIcon,
  Support as SupportIcon,
  SupervisorAccount as ManagerIcon,
  Chat as ChatIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { ThemeContext } from '../../theme/ThemeProvider';
import { useSelector } from 'react-redux';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import API from '../../API';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10
    }
  }
};

// Custom hook for chart management
const useChart = (data, options) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
      chartInstance.current = new ChartJS(chartRef.current, {
        type: 'doughnut',
        data,
        options
      });
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, options]);

  return chartRef;
};

// CEO Dashboard Component
const CEODashboard = ({ colors, isDarkMode }) => {
  const [userStats, setUserStats] = useState({
    totalUsers: 0,
    byRole: {},
    byCategory: {},
    byStatus: {},
    recentUsers: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token');
        const response = await fetch(`${API}/users/stats`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setUserStats(data);
      } catch (error) {
        console.error('Error fetching user stats:', error);
        setError('Failed to load user statistics. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserStats();
  }, []);

  const roleData = {
    labels: Object.keys(userStats.byRole),
    datasets: [{
      data: Object.values(userStats.byRole),
      backgroundColor: [
        alpha(colors.primary, 0.8),
        alpha(colors.secondary, 0.8),
        alpha('#4caf50', 0.8),
      ],
      borderColor: [
        colors.primary,
        colors.secondary,
        '#4caf50',
      ],
      borderWidth: 1,
    }]
  };

  const categoryData = {
    labels: Object.keys(userStats.byCategory),
    datasets: [{
      data: Object.values(userStats.byCategory),
      backgroundColor: [
        alpha('#2196f3', 0.8),
        alpha('#ff9800', 0.8),
        alpha('#9c27b0', 0.8),
      ],
      borderColor: [
        '#2196f3',
        '#ff9800',
        '#9c27b0',
      ],
      borderWidth: 1,
    }]
  };

  const statusData = {
    labels: Object.keys(userStats.byStatus).map(status => status.charAt(0).toUpperCase() + status.slice(1)),
    datasets: [{
      data: Object.values(userStats.byStatus),
      backgroundColor: [
        alpha('#4caf50', 0.8),
        alpha('#f44336', 0.8),
      ],
      borderColor: [
        '#4caf50',
        '#f44336',
      ],
      borderWidth: 1,
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: colors.text,
          padding: 20,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '400px',
        gap: 2
      }}>
        <Typography color="error" variant="h6">{error}</Typography>
        <Button
          variant="contained"
          onClick={() => window.location.reload()}
          sx={{
            bgcolor: colors.primary,
            '&:hover': {
              bgcolor: alpha(colors.primary, 0.8),
            }
          }}
        >
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <>
      {/* Top Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Total Users"
            value={userStats.totalUsers}
            icon={<People />}
            color={colors.primary}
            isDarkMode={isDarkMode}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Active Users"
            value={userStats.byStatus.active || 0}
            icon={<CheckCircle />}
            color="#4caf50"
            isDarkMode={isDarkMode}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Inactive Users"
            value={userStats.byStatus.inactive || 0}
            icon={<Warning />}
            color="#f44336"
            isDarkMode={isDarkMode}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Employees"
            value={userStats.byRole.Employee || 0}
            icon={<EngineeringIcon />}
            color="#2196f3"
            isDarkMode={isDarkMode}
          />
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              p: 3,
              background: isDarkMode ? alpha('#19234d', 0.7) : '#ffffff',
              backdropFilter: 'blur(10px)',
              border: `1px solid ${colors.border}`,
              height: '100%',
              transition: 'transform 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-5px)',
              }
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, color: colors.text }}>Role Distribution</Typography>
            <Box sx={{ height: 300, position: 'relative' }}>
              <Doughnut data={roleData} options={chartOptions} />
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              p: 3,
              background: isDarkMode ? alpha('#19234d', 0.7) : '#ffffff',
              backdropFilter: 'blur(10px)',
              border: `1px solid ${colors.border}`,
              height: '100%',
              transition: 'transform 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-5px)',
              }
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, color: colors.text }}>Category Distribution</Typography>
            <Box sx={{ height: 300, position: 'relative' }}>
              <Doughnut data={categoryData} options={chartOptions} />
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              p: 3,
              background: isDarkMode ? alpha('#19234d', 0.7) : '#ffffff',
              backdropFilter: 'blur(10px)',
              border: `1px solid ${colors.border}`,
              height: '100%',
              transition: 'transform 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-5px)',
              }
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, color: colors.text }}>Status Distribution</Typography>
            <Box sx={{ height: 300, position: 'relative' }}>
              <Doughnut data={statusData} options={chartOptions} />
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Users Table */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card
            sx={{
              p: 3,
              background: isDarkMode ? alpha('#19234d', 0.7) : '#ffffff',
              backdropFilter: 'blur(10px)',
              border: `1px solid ${colors.border}`,
              transition: 'transform 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-5px)',
              }
            }}
          >
            <Typography variant="h6" sx={{ mb: 3, color: colors.text }}>Recent Users</Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: colors.text }}>Name</TableCell>
                    <TableCell sx={{ color: colors.text }}>Email</TableCell>
                    <TableCell sx={{ color: colors.text }}>Role</TableCell>
                    <TableCell sx={{ color: colors.text }}>Category</TableCell>
                    <TableCell sx={{ color: colors.text }}>Joined Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {userStats.recentUsers.map((user) => (
                    <TableRow
                      key={user._id}
                      sx={{
                        '&:hover': {
                          backgroundColor: isDarkMode ? alpha(colors.primary, 0.1) : alpha(colors.primary, 0.05),
                        },
                      }}
                    >
                      <TableCell sx={{ color: colors.text }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar sx={{ bgcolor: alpha(colors.primary, 0.1) }}>
                            {user.name.charAt(0)}
                          </Avatar>
                          {user.name}
                        </Box>
                      </TableCell>
                      <TableCell sx={{ color: colors.text }}>{user.email}</TableCell>
                      <TableCell>
                        <Chip
                          label={user.role}
                          size="small"
                          sx={{
                            bgcolor: user.role === 'CEO' ? alpha(colors.primary, 0.1) :
                              user.role === 'Manager' ? alpha(colors.secondary, 0.1) :
                                alpha('#4caf50', 0.1),
                            color: user.role === 'CEO' ? colors.primary :
                              user.role === 'Manager' ? colors.secondary :
                                '#4caf50',
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ color: colors.text }}>{user.category}</TableCell>
                      <TableCell sx={{ color: colors.text }}>
                        {new Date(user.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

// Manager Dashboard Component
const ManagerDashboard = ({ colors, isDarkMode }) => {
  const [teamStats, setTeamStats] = useState({
    total: 15,
    present: 12,
    tasks: { assigned: 25, completed: 18, overdue: 3 }
  });

  return (
    <>
      {/* Top Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Team Members"
            value={teamStats.total}
            icon={<GroupIcon />}
            color="#2196f3"
            isDarkMode={isDarkMode}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Present Today"
            value={teamStats.present}
            icon={<CheckCircle />}
            color="#4caf50"
            isDarkMode={isDarkMode}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Tasks Assigned"
            value={teamStats.tasks.assigned}
            icon={<Assignment />}
            color="#ff9800"
            isDarkMode={isDarkMode}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Tasks Overdue"
            value={teamStats.tasks.overdue}
            icon={<Warning />}
            color="#f44336"
            isDarkMode={isDarkMode}
          />
        </Grid>
      </Grid>

      {/* Team Overview & Tasks */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card
            sx={{
              p: 3,
              background: isDarkMode ? alpha('#19234d', 0.7) : '#ffffff',
              backdropFilter: 'blur(10px)',
              border: `1px solid ${colors.border}`,
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ color: colors.text }}>Team Overview</Typography>
              <Button
                startIcon={<ChatIcon />}
                sx={{ color: colors.primary }}
                onClick={() => { }}
              >
                Group Chat
              </Button>
            </Box>
            <List>
              {/* Sample team members - replace with actual data */}
              {[1, 2, 3].map((member) => (
                <ListItem key={member}>
                  <ListItemAvatar>
                    <Badge
                      overlap="circular"
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                      variant="dot"
                      color="success"
                    >
                      <Avatar src={`https://randomuser.me/api/portraits/persons/${member}.jpg`} />
                    </Badge>
                  </ListItemAvatar>
                  <ListItemText
                    primary={<Typography color={colors.text}>Team Member {member}</Typography>}
                    secondary={
                      <Typography color="textSecondary" variant="body2">
                        Last active: 2 hours ago
                      </Typography>
                    }
                  />
                  <Chip
                    label="Online"
                    size="small"
                    sx={{
                      bgcolor: alpha('#4caf50', 0.1),
                      color: '#4caf50',
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              p: 3,
              height: '100%',
              background: isDarkMode ? alpha('#19234d', 0.7) : '#ffffff',
              backdropFilter: 'blur(10px)',
              border: `1px solid ${colors.border}`,
            }}
          >
            <Typography variant="h6" sx={{ mb: 3, color: colors.text }}>Quick Actions</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<Assignment />}
                  sx={{
                    bgcolor: isDarkMode ? alpha(colors.primary, 0.2) : alpha(colors.primary, 0.1),
                    color: colors.primary,
                    p: 2,
                    mb: 2,
                    '&:hover': {
                      bgcolor: isDarkMode ? alpha(colors.primary, 0.3) : alpha(colors.primary, 0.2),
                    }
                  }}
                >
                  Assign New Task
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<Event />}
                  sx={{
                    bgcolor: isDarkMode ? alpha(colors.primary, 0.2) : alpha(colors.primary, 0.1),
                    color: colors.primary,
                    p: 2,
                    '&:hover': {
                      bgcolor: isDarkMode ? alpha(colors.primary, 0.3) : alpha(colors.primary, 0.2),
                    }
                  }}
                >
                  Schedule Meeting
                </Button>
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

// Employee Dashboard Component
const EmployeeDashboard = ({ colors, isDarkMode }) => {
  const [employeeStats, setEmployeeStats] = useState({
    tasks: { pending: 5, completed: 15 },
    attendance: { present: 18, total: 22 },
    nextHoliday: 'Christmas - Dec 25'
  });

  return (
    <>
      {/* Top Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Pending Tasks"
            value={employeeStats.tasks.pending}
            icon={<Assignment />}
            color="#ff9800"
            isDarkMode={isDarkMode}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Completed Tasks"
            value={employeeStats.tasks.completed}
            icon={<CheckCircle />}
            color="#4caf50"
            isDarkMode={isDarkMode}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Days Present"
            value={`${employeeStats.attendance.present}/${employeeStats.attendance.total}`}
            icon={<Event />}
            color="#2196f3"
            isDarkMode={isDarkMode}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Next Holiday"
            value="Dec 25"
            icon={<CalendarToday />}
            color="#9c27b0"
            isDarkMode={isDarkMode}
          />
        </Grid>
      </Grid>

      {/* Task Progress & Profile */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card
            sx={{
              p: 3,
              background: isDarkMode ? alpha('#19234d', 0.7) : '#ffffff',
              backdropFilter: 'blur(10px)',
              border: `1px solid ${colors.border}`,
            }}
          >
            <Typography variant="h6" sx={{ mb: 3, color: colors.text }}>Task Progress</Typography>
            <List>
              {/* Sample tasks - replace with actual data */}
              {[
                { title: 'Complete Project Documentation', progress: 75, status: 'in-progress' },
                { title: 'Review Code Changes', progress: 90, status: 'completed' },
                { title: 'Update Test Cases', progress: 30, status: 'pending' },
              ].map((task, index) => (
                <ListItem key={index} sx={{ mb: 2 }}>
                  <Box sx={{ width: '100%' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography color={colors.text}>{task.title}</Typography>
                      <Typography color={colors.text}>{task.progress}%</Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={task.progress}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        bgcolor: isDarkMode ? alpha('#ffffff', 0.1) : alpha('#000000', 0.1),
                        '& .MuiLinearProgress-bar': {
                          bgcolor: task.status === 'completed' ? '#4caf50' : '#2196f3',
                        }
                      }}
                    />
                  </Box>
                </ListItem>
              ))}
            </List>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              p: 3,
              height: '100%',
              background: isDarkMode ? alpha('#19234d', 0.7) : '#ffffff',
              backdropFilter: 'blur(10px)',
              border: `1px solid ${colors.border}`,
            }}
          >
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Avatar
                sx={{ width: 100, height: 100, mx: 'auto', mb: 2 }}
                src="https://randomuser.me/api/portraits/men/1.jpg"
              />
              <Typography variant="h6" sx={{ color: colors.text }}>John Doe</Typography>
              <Typography color="textSecondary">Software Developer</Typography>
            </Box>
            <Divider sx={{ my: 2 }} />
            <List>
              <ListItem>
                <ListItemIcon>
                  <Email sx={{ color: colors.primary }} />
                </ListItemIcon>
                <ListItemText
                  primary={<Typography color={colors.text}>john.doe@company.com</Typography>}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Phone sx={{ color: colors.primary }} />
                </ListItemIcon>
                <ListItemText
                  primary={<Typography color={colors.text}>+1 234 567 890</Typography>}
                />
              </ListItem>
            </List>
            <Box sx={{ mt: 2 }}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<EditIcon />}
                sx={{
                  bgcolor: isDarkMode ? alpha(colors.primary, 0.2) : alpha(colors.primary, 0.1),
                  color: colors.primary,
                  p: 2,
                  '&:hover': {
                    bgcolor: isDarkMode ? alpha(colors.primary, 0.3) : alpha(colors.primary, 0.2),
                  }
                }}
              >
                Edit Profile
              </Button>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

// Stats Card Component
const StatsCard = ({ title, value, icon, color, isDarkMode, details }) => (
  <Card
    sx={{
      p: 3,
      height: '100%',
      // minHeight: 200,
      background: isDarkMode
        ? `linear-gradient(135deg, ${alpha('#19234d', 0.9)} 0%, ${alpha('#19234d', 0.7)} 100%)`
        : `linear-gradient(135deg, ${alpha('#ffffff', 0.9)} 0%, ${alpha('#ffffff', 0.7)} 100%)`,
      backdropFilter: 'blur(10px)',
      border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)'}`,
      transition: 'all 0.3s ease',
      position: 'relative',
      overflow: 'hidden',
      '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: isDarkMode
          ? `0 8px 32px ${alpha(color, 0.2)}`
          : `0 8px 32px ${alpha(color, 0.1)}`,
        '&::before': {
          transform: 'scale(1.1)',
        }
      },
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `radial-gradient(circle at top right, ${alpha(color, 0.1)}, transparent 70%)`,
        transition: 'transform 0.3s ease',
        zIndex: 0
      }
    }}
  >
    <Box sx={{ position: 'relative', zIndex: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Avatar
          sx={{
            bgcolor: alpha(color, 0.1),
            color: color,
            width: 56,
            height: 56,
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'scale(1.1) rotate(5deg)',
            }
          }}
        >
          {icon}
        </Avatar>
        <Box sx={{ ml: 2 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: isDarkMode ? '#fff' : '#000',
              textShadow: `0 2px 4px ${alpha(color, 0.2)}`,
              mb: 0.5
            }}
          >
            {value}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
              fontWeight: 500
            }}
          >
            {title}
          </Typography>
        </Box>
      </Box>
      {details && (
        <Box sx={{ mt: 2 }}>
          <Divider sx={{
            mb: 2,
            borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)'
          }} />
          {Object.entries(details).map(([key, value]) => (
            <Box
              key={key}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 1,
                p: 1,
                borderRadius: 1,
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: isDarkMode ? alpha(color, 0.1) : alpha(color, 0.05),
                }
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
                  fontWeight: 500
                }}
              >
                {key}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: isDarkMode ? '#fff' : '#000',
                    fontWeight: 600,
                    minWidth: 24,
                    textAlign: 'right'
                  }}
                >
                  {value}
                </Typography>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: color,
                    opacity: 0.8
                  }}
                />
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  </Card>
);

// Main Dashboard Component
const Dashboard = () => {
  const theme = useTheme();
  const { isDarkMode } = useContext(ThemeContext);
  const { user } = useSelector((state) => state.auth);
  const [stats, setStats] = useState({
    employees: 0,
    attendance: 0,
    tasks: 0,
    events: 0
  });

  // Initialize theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme && savedTheme !== (isDarkMode ? 'dark' : 'light')) {
      // The theme will be updated by the ThemeProvider
      console.log('Theme initialized from localStorage:', savedTheme);
    }
  }, []);

  // Theme-based colors
  const colors = {
    primary: isDarkMode ? '#d9764a' : '#2b5a9e',
    secondary: isDarkMode ? '#2b5a9e' : '#d9764a',
    background: isDarkMode ? '#151b3b' : '#f5f5f5',
    cardBg: isDarkMode ? '#19234d' : '#ffffff',
    text: isDarkMode ? '#f5f5f5' : '#19234d',
    border: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)',
    gradientStart: isDarkMode ? 'rgba(217, 118, 74, 0.05)' : 'rgba(43, 90, 158, 0.02)',
    gradientEnd: isDarkMode ? 'rgba(43, 90, 158, 0.05)' : 'rgba(217, 118, 74, 0.02)',
  };

  // Render dashboard based on user role
  const renderDashboard = () => {
    const role = localStorage.getItem('role');
    switch (role) {
      case 'CEO':
        return <CEODashboard colors={colors} isDarkMode={isDarkMode} />;
      case 'Manager':
        return <ManagerDashboard colors={colors} isDarkMode={isDarkMode} />;
      default:
        return <EmployeeDashboard colors={colors} isDarkMode={isDarkMode} />;
    }
  };

  return (
    <Box
      component={motion.div}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      sx={{
        p: 3,
        minHeight: '100vh',
        background: isDarkMode
          ? 'linear-gradient(135deg, #151b3b 0%, #19234d 100%)'
          : 'linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%)',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `radial-gradient(circle at 50% 50%, ${colors.gradientStart}, transparent)`,
          opacity: 0.5,
          pointerEvents: 'none',
          zIndex: 0
        }
      }}
    >
      {/* Welcome Section */}
      <Box
        component={motion.div}
        variants={itemVariants}
        sx={{
          mb: 4,
          position: 'relative',
          zIndex: 1
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: colors.text,
            mb: 1
          }}
        >
          Welcome back, {user?.name || 'User'}!
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
            maxWidth: '600px'
          }}
        >
          Here's your dashboard overview.
        </Typography>
      </Box>

      {/* Role-based Dashboard Content */}
      {renderDashboard()}
    </Box>
  );
};

export default Dashboard; 
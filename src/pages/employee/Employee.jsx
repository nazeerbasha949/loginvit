import React, { useState, useEffect, useContext } from 'react';
import { useSelector } from 'react-redux';
import { ThemeContext } from '../../theme/ThemeProvider';
import axios from 'axios';
import API from '../../API';
import {
    Box,
    Paper,
    Typography,
    Button,
    TextField,
    Grid,
    IconButton,
    Avatar,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Tooltip,
    InputAdornment,
    CircularProgress,
    LinearProgress,
    Fade,
    Zoom,
    Collapse,
    Card,
    CardContent,
    CardHeader,
    Divider,
    useTheme,
    alpha,
    Tabs,
    Tab,
    Menu,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    Backdrop,
    Alert,
    Snackbar,
    Badge,
    Switch,
    FormControlLabel,
    Autocomplete,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Search as SearchIcon,
    FilterList as FilterIcon,
    Refresh as RefreshIcon,
    Visibility as VisibilityIcon,
    VisibilityOff as VisibilityOffIcon,
    Person as PersonIcon,
    Email as EmailIcon,
    Phone as PhoneIcon,
    Work as WorkIcon,
    Category as CategoryIcon,
    MoreVert as MoreVertIcon,
    Close as CloseIcon,
    Save as SaveIcon,
    CheckCircle as CheckCircleIcon,
    Cancel as CancelIcon,
    Message as MessageIcon,
    Assignment as AssignmentIcon,
    SupervisorAccount as SupervisorIcon,
    Group as GroupIcon,
    Sort as SortIcon,
    ArrowUpward as ArrowUpIcon,
    ArrowDownward as ArrowDownIcon,
    Dashboard as DashboardIcon,
    CalendarToday as CalendarIcon,
    Settings as SettingsIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { format } from 'date-fns';
import Swal from 'sweetalert2';

// Styled components
const StyledPaper = styled(Paper)(({ theme, isDarkMode }) => ({
    borderRadius: 16,
    overflow: 'hidden',
    boxShadow: isDarkMode
        ? '0 8px 32px rgba(0, 0, 0, 0.4)'
        : '0 8px 32px rgba(41, 43, 64, 0.1)',
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
        boxShadow: isDarkMode
            ? '0 10px 40px rgba(0, 0, 0, 0.5)'
            : '0 10px 40px rgba(41, 43, 64, 0.2)',
    },
}));

const StyledTableRow = styled(TableRow)(({ theme, isDarkMode }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: isDarkMode
            ? alpha(theme.palette.primary.main, 0.05)
            : alpha(theme.palette.primary.main, 0.02),
    },
    '&:hover': {
        backgroundColor: isDarkMode
            ? alpha(theme.palette.primary.main, 0.1)
            : alpha(theme.palette.primary.main, 0.05),
        cursor: 'pointer',
        transition: 'background-color 0.2s ease',
    },
    transition: 'background-color 0.2s ease',
}));

const StyledTableCell = styled(TableCell)(({ theme, isDarkMode }) => ({
    borderBottom: `1px solid ${isDarkMode
            ? alpha(theme.palette.divider, 0.3)
            : alpha(theme.palette.divider, 0.5)
        }`,
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
    width: 40,
    height: 40,
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    border: `2px solid ${theme.palette.background.paper}`,
    transition: 'transform 0.2s ease',
    '&:hover': {
        transform: 'scale(1.1)',
    },
}));

const StyledChip = styled(Chip)(({ theme, color }) => ({
    fontWeight: 'bold',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.08)',
    transition: 'all 0.2s ease',
    '&:hover': {
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
        transform: 'translateY(-2px)',
    },
}));

const StyledButton = styled(Button)(({ theme }) => ({
    borderRadius: 8,
    textTransform: 'none',
    fontWeight: 'bold',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.2s ease',
    '&:hover': {
        boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
        transform: 'translateY(-2px)',
    },
}));

const StyledTab = styled(Tab)(({ theme, isDarkMode }) => ({
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '0.9rem',
    minWidth: 100,
    '&.Mui-selected': {
        color: theme.palette.primary.main,
    },
    '&:hover': {
        backgroundColor: isDarkMode
            ? alpha(theme.palette.primary.main, 0.1)
            : alpha(theme.palette.primary.main, 0.05),
        borderRadius: '8px 8px 0 0',
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

const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email format').required('Email is required'),
    password: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
        )
        .required('Password is required'),
    role: Yup.string().required('Role is required'),
    category: Yup.string().required('Category is required'),
    status: Yup.string().required('Status is required'),
});

const updateValidationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email format').required('Email is required'),
    password: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
        )
        .notRequired(),
    role: Yup.string().required('Role is required'),
    category: Yup.string().required('Category is required'),
    status: Yup.string().required('Status is required'),
});

const Employee = () => {
    const { isDarkMode } = useContext(ThemeContext);
    const theme = useTheme();
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.user);

    // State variables
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [openViewDialog, setOpenViewDialog] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterRole, setFilterRole] = useState('all');
    const [filterCategory, setFilterCategory] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [sortField, setSortField] = useState('name');
    const [sortDirection, setSortDirection] = useState('asc');
    const [showPassword, setShowPassword] = useState(false);
    const [activeTab, setActiveTab] = useState(0);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
    const [statistics, setStatistics] = useState({
        total: 0,
        active: 0,
        inactive: 0,
        managers: 0,
        employees: 0,
        categories: {},
    });
    const [refreshKey, setRefreshKey] = useState(0);

    // Check if user is CEO
    const isCEO = localStorage.getItem('role') === 'CEO';

    // Formik for add/edit employee
    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            password: '',
            role: 'Employee',
            category: 'Developer',
            status: 'active',
            profilePic: '',
        },
        validationSchema: selectedEmployee ? updateValidationSchema : validationSchema,
        onSubmit: async (values) => {
            try {
                setLoading(true);
                const token = localStorage.getItem('token');

                if (selectedEmployee) {
                    // Update employee
                    const updateData = { ...values };
                    if (!updateData.password) {
                        delete updateData.password;
                    }

                    await axios.put(`${API}/users/${selectedEmployee._id}`, updateData, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    setSuccess('Employee updated successfully');
                } else {
                    // Create employee
                    await axios.post(`${API}/users`, values, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    setSuccess('Employee created successfully');
                }

                setOpenDialog(false);
                setRefreshKey(prev => prev + 1);
            } catch (err) {
                setError(err.response?.data?.message || 'An error occurred');
            } finally {
                setLoading(false);
            }
        },
    });

    // Fetch employees
    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('token');

                const response = await axios.get(`${API}/users`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setEmployees(response.data.users);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch employees');
            } finally {
                setLoading(false);
            }
        };

        if (isCEO) {
            fetchEmployees();
        }
    }, [isCEO, refreshKey]);

    // Fetch statistics
    useEffect(() => {
        const fetchStatistics = async () => {
            try {
                const token = localStorage.getItem('token');

                const response = await axios.get(`${API}/users/stats`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                // Update to match the backend response structure
                const data = response.data;
                setStatistics({
                    total: data.totalUsers || 0,
                    active: data.byStatus?.active || 0,
                    inactive: data.byStatus?.inactive || 0,
                    managers: data.byRole?.Manager || 0,
                    employees: data.byRole?.Employee || 0,
                    categories: data.byCategory || {},
                });
            } catch (err) {
                console.error('Failed to fetch statistics:', err);
                if (err.response) {
                    console.error('Error response:', err.response.data);
                    console.error('Status code:', err.response.status);
                }
            }
        };

        if (isCEO) {
            fetchStatistics();
        }
    }, [isCEO, refreshKey]);

    // Handle dialog open/close
    const handleOpenDialog = (employee = null) => {
        if (employee) {
            setSelectedEmployee(employee);
            formik.setValues({
                name: employee.name || '',
                email: employee.email || '',
                password: '',
                role: employee.role || 'Employee',
                category: employee.category || 'Developer',
                status: employee.status || 'active',
                profilePic: employee.profilePic || '',
            });
        } else {
            setSelectedEmployee(null);
            formik.resetForm();
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedEmployee(null);
        formik.resetForm();
    };

    // Handle view dialog
    const handleOpenViewDialog = (employee) => {
        setSelectedEmployee(employee);
        setOpenViewDialog(true);
    };

    const handleCloseViewDialog = () => {
        setOpenViewDialog(false);
        setSelectedEmployee(null);
    };

    // Handle delete employee
    const handleDeleteEmployee = (employeeId) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: theme.palette.error.main,
            cancelButtonColor: theme.palette.grey[500],
            confirmButtonText: 'Yes, delete it!',
            background: isDarkMode ? theme.palette.background.paper : '#fff',
            color: isDarkMode ? theme.palette.text.primary : '#000',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    setLoading(true);
                    const token = localStorage.getItem('token');

                    await axios.delete(`${API}/users/${employeeId}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    Swal.fire({
                        title: 'Deleted!',
                        text: 'Employee has been deleted.',
                        icon: 'success',
                        background: isDarkMode ? theme.palette.background.paper : '#fff',
                        color: isDarkMode ? theme.palette.text.primary : '#000',
                    });

                    setRefreshKey(prev => prev + 1);
                } catch (err) {
                    Swal.fire({
                        title: 'Error!',
                        text: err.response?.data?.message || 'Failed to delete employee',
                        icon: 'error',
                        background: isDarkMode ? theme.palette.background.paper : '#fff',
                        color: isDarkMode ? theme.palette.text.primary : '#000',
                    });
                } finally {
                    setLoading(false);
                }
            }
        });
    };

    // Handle pagination
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Handle sorting
    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    // Handle menu
    const handleMenuOpen = (event, employeeId) => {
        setAnchorEl(event.currentTarget);
        setSelectedEmployeeId(employeeId);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedEmployeeId(null);
    };

    // Handle tab change
    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    // Handle message employee
    const handleMessageEmployee = (employeeId) => {
        navigate(`/chat?userId=${employeeId}`);
    };

    // Handle assign task
    const handleAssignTask = (employeeId) => {
        navigate(`/tasks?assignTo=${employeeId}`);
    };

    // Filter and sort employees
    const filteredEmployees = employees
        .filter((employee) => {
            const matchesSearch = employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                employee.email.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesRole = filterRole === 'all' || employee.role === filterRole;
            const matchesCategory = filterCategory === 'all' || employee.category === filterCategory;
            const matchesStatus = filterStatus === 'all' || employee.status === filterStatus;

            return matchesSearch && matchesRole && matchesCategory && matchesStatus;
        })
        .sort((a, b) => {
            let comparison = 0;

            if (sortField === 'name') {
                comparison = a.name.localeCompare(b.name);
            } else if (sortField === 'email') {
                comparison = a.email.localeCompare(b.email);
            } else if (sortField === 'role') {
                comparison = a.role.localeCompare(b.role);
            } else if (sortField === 'category') {
                comparison = a.category.localeCompare(b.category);
            } else if (sortField === 'status') {
                comparison = a.status.localeCompare(b.status);
            } else if (sortField === 'createdAt') {
                comparison = new Date(a.createdAt) - new Date(b.createdAt);
            }

            return sortDirection === 'asc' ? comparison : -comparison;
        });

    // Pagination
    const paginatedEmployees = filteredEmployees.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    // Get role color
    const getRoleColor = (role) => {
        switch (role) {
            case 'CEO':
                return theme.palette.error.main;
            case 'Manager':
                return theme.palette.warning.main;
            case 'Employee':
                return theme.palette.success.main;
            default:
                return theme.palette.primary.main;
        }
    };

    // Get category color
    const getCategoryColor = (category) => {
        switch (category) {
            case 'HR':
                return theme.palette.info.main;
            case 'Developer':
                return theme.palette.secondary.main;
            case 'DevOps':
                return '#9c27b0'; // Purple
            default:
                return theme.palette.primary.main;
        }
    };

    // Get status color
    const getStatusColor = (status) => {
        return status === 'active' ? '#4caf50' : '#f44336';
    };

    // Render statistics cards
    const renderStatisticsCards = () => {
        return (
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card
                        component={motion.div}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        sx={{
                            borderRadius: 3,
                            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                            overflow: 'hidden',
                            height: '100%',
                        }}
                    >
                        <Box sx={{
                            p: 2,
                            background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.dark} 90%)`,
                            color: 'white'
                        }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="h6" fontWeight="bold">Total Users</Typography>
                                <Avatar sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)' }}>
                                    <GroupIcon />
                                </Avatar>
                            </Box>
                        </Box>
                        <CardContent sx={{ pt: 2 }}>
                            <Typography variant="h3" component="div" fontWeight="bold" align="center">
                                {statistics.total || 0}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
                                Total registered users in the system
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card
                        component={motion.div}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                        sx={{
                            borderRadius: 3,
                            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                            overflow: 'hidden',
                            height: '100%',
                        }}
                    >
                        <Box sx={{
                            p: 2,
                            background: `linear-gradient(45deg, ${theme.palette.success.main} 30%, ${theme.palette.success.dark} 90%)`,
                            color: 'white'
                        }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="h6" fontWeight="bold">Active Users</Typography>
                                <Avatar sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)' }}>
                                    <CheckCircleIcon />
                                </Avatar>
                            </Box>
                        </Box>
                        <CardContent sx={{ pt: 2 }}>
                            <Typography variant="h3" component="div" fontWeight="bold" align="center">
                                {statistics.active || 0}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
                                Currently active users
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card
                        component={motion.div}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                        sx={{
                            borderRadius: 3,
                            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                            overflow: 'hidden',
                            height: '100%',
                        }}
                    >
                        <Box sx={{
                            p: 2,
                            background: `linear-gradient(45deg, ${theme.palette.warning.main} 30%, ${theme.palette.warning.dark} 90%)`,
                            color: 'white'
                        }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="h6" fontWeight="bold">Managers</Typography>
                                <Avatar sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)' }}>
                                    <SupervisorIcon />
                                </Avatar>
                            </Box>
                        </Box>
                        <CardContent sx={{ pt: 2 }}>
                            <Typography variant="h3" component="div" fontWeight="bold" align="center">
                                {statistics.managers || 0}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
                                Total managers in the system
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card
                        component={motion.div}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.3 }}
                        sx={{
                            borderRadius: 3,
                            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                            overflow: 'hidden',
                            height: '100%',
                        }}
                    >
                        <Box sx={{
                            p: 2,
                            background: `linear-gradient(45deg, ${theme.palette.info.main} 30%, ${theme.palette.info.dark} 90%)`,
                            color: 'white'
                        }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="h6" fontWeight="bold">Employees</Typography>
                                <Avatar sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)' }}>
                                    <PersonIcon />
                                </Avatar>
                            </Box>
                        </Box>
                        <CardContent sx={{ pt: 2 }}>
                            <Typography variant="h3" component="div" fontWeight="bold" align="center">
                                {statistics.employees || 0}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
                                Total employees in the system
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        );
    };

    // Render category distribution
    const renderCategoryDistribution = () => {
        const categories = statistics.categories || {};
        const categoryNames = Object.keys(categories);

        return (
            <Card
                component={motion.div}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
                sx={{
                    borderRadius: 3,
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                    mb: 4,
                    overflow: 'hidden',
                }}
            >
                <CardHeader
                    title="Category Distribution"
                    subheader="Number of employees in each category"
                    sx={{
                        borderBottom: 1,
                        borderColor: 'divider',
                        '& .MuiCardHeader-title': {
                            fontWeight: 'bold',
                        },
                    }}
                />
                <CardContent>
                    <Grid container spacing={2}>
                        {categoryNames.map((category) => (
                            <Grid item xs={12} sm={4} key={category}>
                                <Box sx={{
                                    p: 2,
                                    borderRadius: 2,
                                    bgcolor: alpha(getCategoryColor(category), 0.1),
                                    border: `1px solid ${alpha(getCategoryColor(category), 0.3)}`,
                                }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                        <Typography variant="h6" fontWeight="bold">{category}</Typography>
                                        <Chip
                                            label={categories[category]}
                                            sx={{
                                                bgcolor: getCategoryColor(category),
                                                color: 'white',
                                                fontWeight: 'bold',
                                            }}
                                        />
                                    </Box>
                                    <Box sx={{ mt: 1 }}>
                                        <LinearProgress
                                            variant="determinate"
                                            value={(categories[category] / statistics.total) * 100}
                                            sx={{
                                                height: 8,
                                                borderRadius: 4,
                                                bgcolor: alpha(getCategoryColor(category), 0.2),
                                                '& .MuiLinearProgress-bar': {
                                                    bgcolor: getCategoryColor(category),
                                                }
                                            }}
                                        />
                                    </Box>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </CardContent>
            </Card>
        );
    };

    // Render employee table
    const renderEmployeeTable = () => {
        return (
            <StyledPaper elevation={3} isDarkMode={isDarkMode}>
                <Box sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Typography variant="h5" fontWeight="bold">
                            Employee Management
                        </Typography>
                        <StyledButton
                            variant="contained"
                            color="primary"
                            startIcon={<AddIcon />}
                            onClick={() => handleOpenDialog()}
                        >
                            Add Employee
                        </StyledButton>
                    </Box>

                    <Box sx={{ mb: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    placeholder="Search by name or email"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{ bgcolor: isDarkMode ? alpha('#fff', 0.05) : alpha('#f5f5f5', 0.7) }}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Box sx={{ display: 'flex', gap: 2 }}>
                                    <FormControl size="small" sx={{ minWidth: 120 }}>
                                        <InputLabel>Role</InputLabel>
                                        <Select
                                            value={filterRole}
                                            onChange={(e) => setFilterRole(e.target.value)}
                                            label="Role"
                                        >
                                            <MenuItem value="all">All Roles</MenuItem>
                                            <MenuItem value="CEO">CEO</MenuItem>
                                            <MenuItem value="Manager">Manager</MenuItem>
                                            <MenuItem value="Employee">Employee</MenuItem>
                                        </Select>
                                    </FormControl>

                                    <FormControl size="small" sx={{ minWidth: 120 }}>
                                        <InputLabel>Category</InputLabel>
                                        <Select
                                            value={filterCategory}
                                            onChange={(e) => setFilterCategory(e.target.value)}
                                            label="Category"
                                        >
                                            <MenuItem value="all">All Categories</MenuItem>
                                            <MenuItem value="HR">HR</MenuItem>
                                            <MenuItem value="Developer">Developer</MenuItem>
                                            <MenuItem value="DevOps">DevOps</MenuItem>
                                        </Select>
                                    </FormControl>

                                    <FormControl size="small" sx={{ minWidth: 120 }}>
                                        <InputLabel>Status</InputLabel>
                                        <Select
                                            value={filterStatus}
                                            onChange={(e) => setFilterStatus(e.target.value)}
                                            label="Status"
                                        >
                                            <MenuItem value="all">All Status</MenuItem>
                                            <MenuItem value="active">Active</MenuItem>
                                            <MenuItem value="inactive">Inactive</MenuItem>
                                        </Select>
                                    </FormControl>

                                    <Tooltip title="Refresh">
                                        <IconButton onClick={() => setRefreshKey(prev => prev + 1)}>
                                            <RefreshIcon />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>

                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                            <CircularProgress />
                        </Box>
                    ) : filteredEmployees.length === 0 ? (
                        <Box sx={{ textAlign: 'center', py: 4 }}>
                            <Typography variant="h6" color="text.secondary">
                                No employees found
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                Try adjusting your search or filters
                            </Typography>
                        </Box>
                    ) : (
                        <>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        cursor: 'pointer',
                                                        userSelect: 'none',
                                                    }}
                                                    onClick={() => handleSort('name')}
                                                >
                                                    Employee
                                                    {sortField === 'name' && (
                                                        sortDirection === 'asc' ? <ArrowUpIcon fontSize="small" /> : <ArrowDownIcon fontSize="small" />
                                                    )}
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        cursor: 'pointer',
                                                        userSelect: 'none',
                                                    }}
                                                    onClick={() => handleSort('email')}
                                                >
                                                    Email
                                                    {sortField === 'email' && (
                                                        sortDirection === 'asc' ? <ArrowUpIcon fontSize="small" /> : <ArrowDownIcon fontSize="small" />
                                                    )}
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        cursor: 'pointer',
                                                        userSelect: 'none',
                                                    }}
                                                    onClick={() => handleSort('role')}
                                                >
                                                    Role
                                                    {sortField === 'role' && (
                                                        sortDirection === 'asc' ? <ArrowUpIcon fontSize="small" /> : <ArrowDownIcon fontSize="small" />
                                                    )}
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        cursor: 'pointer',
                                                        userSelect: 'none',
                                                    }}
                                                    onClick={() => handleSort('category')}
                                                >
                                                    Category
                                                    {sortField === 'category' && (
                                                        sortDirection === 'asc' ? <ArrowUpIcon fontSize="small" /> : <ArrowDownIcon fontSize="small" />
                                                    )}
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        cursor: 'pointer',
                                                        userSelect: 'none',
                                                    }}
                                                    onClick={() => handleSort('status')}
                                                >
                                                    Status
                                                    {sortField === 'status' && (
                                                        sortDirection === 'asc' ? <ArrowUpIcon fontSize="small" /> : <ArrowDownIcon fontSize="small" />
                                                    )}
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        cursor: 'pointer',
                                                        userSelect: 'none',
                                                    }}
                                                    onClick={() => handleSort('createdAt')}
                                                >
                                                    Joined
                                                    {sortField === 'createdAt' && (
                                                        sortDirection === 'asc' ? <ArrowUpIcon fontSize="small" /> : <ArrowDownIcon fontSize="small" />
                                                    )}
                                                </Box>
                                            </TableCell>
                                            <TableCell align="right">Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {paginatedEmployees.map((employee) => (
                                            <StyledTableRow
                                                key={employee._id}
                                                isDarkMode={isDarkMode}
                                                onClick={() => handleOpenViewDialog(employee)}
                                            >
                                                <StyledTableCell isDarkMode={isDarkMode}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        {employee.status === 'active' ? (
                                                            <StyledBadge
                                                                overlap="circular"
                                                                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                                                variant="dot"
                                                            >
                                                                <StyledAvatar src={employee.profilePic} alt={employee.name}>
                                                                    {employee.name ? employee.name.charAt(0).toUpperCase() : <PersonIcon />}
                                                                </StyledAvatar>
                                                            </StyledBadge>
                                                        ) : (
                                                            <StyledAvatar src={employee.profilePic} alt={employee.name}>
                                                                {employee.name ? employee.name.charAt(0).toUpperCase() : <PersonIcon />}
                                                            </StyledAvatar>
                                                        )}
                                                        <Box sx={{ ml: 2 }}>
                                                            <Typography variant="subtitle2" fontWeight="bold">
                                                                {employee.name}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                </StyledTableCell>
                                                <StyledTableCell isDarkMode={isDarkMode}>
                                                    <Typography variant="body2">{employee.email}</Typography>
                                                </StyledTableCell>
                                                <StyledTableCell isDarkMode={isDarkMode}>
                                                    <StyledChip
                                                        label={employee.role}
                                                        size="small"
                                                        sx={{
                                                            bgcolor: alpha(getRoleColor(employee.role), 0.1),
                                                            color: getRoleColor(employee.role),
                                                            borderColor: getRoleColor(employee.role),
                                                            border: '1px solid',
                                                        }}
                                                    />
                                                </StyledTableCell>
                                                <StyledTableCell isDarkMode={isDarkMode}>
                                                    <StyledChip
                                                        label={employee.category}
                                                        size="small"
                                                        sx={{
                                                            bgcolor: alpha(getCategoryColor(employee.category), 0.1),
                                                            color: getCategoryColor(employee.category),
                                                            borderColor: getCategoryColor(employee.category),
                                                            border: '1px solid',
                                                        }}
                                                    />
                                                </StyledTableCell>
                                                <StyledTableCell isDarkMode={isDarkMode}>
                                                    <StyledChip
                                                        label={employee.status === 'active' ? 'Active' : 'Inactive'}
                                                        size="small"
                                                        sx={{
                                                            bgcolor: alpha(getStatusColor(employee.status), 0.1),
                                                            color: getStatusColor(employee.status),
                                                            borderColor: getStatusColor(employee.status),
                                                            border: '1px solid',
                                                        }}
                                                    />
                                                </StyledTableCell>
                                                <StyledTableCell isDarkMode={isDarkMode}>
                                                    <Typography variant="body2">
                                                        {employee.createdAt ? format(new Date(employee.createdAt), 'MMM dd, yyyy') : 'N/A'}
                                                    </Typography>
                                                </StyledTableCell>
                                                <StyledTableCell isDarkMode={isDarkMode} align="right">
                                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                                        <Tooltip title="View">
                                                            <IconButton
                                                                size="small"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleOpenViewDialog(employee);
                                                                }}
                                                            >
                                                                <VisibilityIcon fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="Edit">
                                                            <IconButton
                                                                size="small"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleOpenDialog(employee);
                                                                }}
                                                            >
                                                                <EditIcon fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="More">
                                                            <IconButton
                                                                size="small"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleMenuOpen(e, employee._id);
                                                                }}
                                                            >
                                                                <MoreVertIcon fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </Box>
                                                </StyledTableCell>
                                            </StyledTableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25]}
                                component="div"
                                count={filteredEmployees.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </>
                    )}
                </Box>
            </StyledPaper>
        );
    };

    // Render add/edit employee dialog
    const renderEmployeeDialog = () => {
        return (
            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h6">
                            {selectedEmployee ? 'Edit Employee' : 'Add New Employee'}
                        </Typography>
                        <IconButton onClick={handleCloseDialog}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </DialogTitle>
                <form onSubmit={formik.handleSubmit}>
                    <DialogContent dividers>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    id="name"
                                    name="name"
                                    label="Full Name"
                                    value={formik.values.name}
                                    onChange={formik.handleChange}
                                    error={formik.touched.name && Boolean(formik.errors.name)}
                                    helperText={formik.touched.name && formik.errors.name}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <PersonIcon />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    id="email"
                                    name="email"
                                    label="Email Address"
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                    error={formik.touched.email && Boolean(formik.errors.email)}
                                    helperText={formik.touched.email && formik.errors.email}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <EmailIcon />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    id="password"
                                    name="password"
                                    label={selectedEmployee ? "New Password (leave blank to keep current)" : "Password"}
                                    type={showPassword ? 'text' : 'password'}
                                    value={formik.values.password}
                                    onChange={formik.handleChange}
                                    error={formik.touched.password && Boolean(formik.errors.password)}
                                    helperText={formik.touched.password && formik.errors.password}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    edge="start"
                                                    size="small"
                                                >
                                                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth>
                                    <InputLabel id="role-label">Role</InputLabel>
                                    <Select
                                        labelId="role-label"
                                        id="role"
                                        name="role"
                                        value={formik.values.role}
                                        onChange={formik.handleChange}
                                        error={formik.touched.role && Boolean(formik.errors.role)}
                                        label="Role"
                                        startAdornment={
                                            <InputAdornment position="start">
                                                <WorkIcon />
                                            </InputAdornment>
                                        }
                                    >
                                        <MenuItem value="CEO">CEO</MenuItem>
                                        <MenuItem value="Manager">Manager</MenuItem>
                                        <MenuItem value="Employee">Employee</MenuItem>
                                    </Select>
                                    {formik.touched.role && formik.errors.role && (
                                        <Typography color="error" variant="caption">
                                            {formik.errors.role}
                                        </Typography>
                                    )}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth>
                                    <InputLabel id="category-label">Category</InputLabel>
                                    <Select
                                        labelId="category-label"
                                        id="category"
                                        name="category"
                                        value={formik.values.category}
                                        onChange={formik.handleChange}
                                        error={formik.touched.category && Boolean(formik.errors.category)}
                                        label="Category"
                                        startAdornment={
                                            <InputAdornment position="start">
                                                <CategoryIcon />
                                            </InputAdornment>
                                        }
                                    >
                                        <MenuItem value="HR">HR</MenuItem>
                                        <MenuItem value="Developer">Developer</MenuItem>
                                        <MenuItem value="DevOps">DevOps</MenuItem>
                                    </Select>
                                    {formik.touched.category && formik.errors.category && (
                                        <Typography color="error" variant="caption">
                                            {formik.errors.category}
                                        </Typography>
                                    )}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth>
                                    <InputLabel id="status-label">Status</InputLabel>
                                    <Select
                                        labelId="status-label"
                                        id="status"
                                        name="status"
                                        value={formik.values.status}
                                        onChange={formik.handleChange}
                                        error={formik.touched.status && Boolean(formik.errors.status)}
                                        label="Status"
                                        startAdornment={
                                            <InputAdornment position="start">
                                                {formik.values.status === 'active' ? <CheckCircleIcon /> : <CancelIcon />}
                                            </InputAdornment>
                                        }
                                    >
                                        <MenuItem value="active">Active</MenuItem>
                                        <MenuItem value="inactive">Inactive</MenuItem>
                                    </Select>
                                    {formik.touched.status && formik.errors.status && (
                                        <Typography color="error" variant="caption">
                                            {formik.errors.status}
                                        </Typography>
                                    )}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    id="profilePic"
                                    name="profilePic"
                                    label="Profile Picture URL (optional)"
                                    value={formik.values.profilePic}
                                    onChange={formik.handleChange}
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions sx={{ px: 3, py: 2 }}>
                        <Button
                            variant="outlined"
                            onClick={handleCloseDialog}
                            startIcon={<CloseIcon />}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={loading}
                            startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                        >
                            {selectedEmployee ? 'Update' : 'Create'}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        );
    };

    // Render view employee dialog
    const renderViewEmployeeDialog = () => {
        if (!selectedEmployee) return null;

        return (
            <Dialog
                open={openViewDialog}
                onClose={handleCloseViewDialog}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h6">Employee Details</Typography>
                        <IconButton onClick={handleCloseViewDialog}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </DialogTitle>
                <DialogContent dividers>
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            p: 3,
                            borderRadius: 2,
                            bgcolor: isDarkMode ? alpha(theme.palette.background.paper, 0.1) : alpha(theme.palette.background.paper, 0.7),
                            width: { xs: '100%', md: '30%' },
                        }}>
                            <Avatar
                                src={selectedEmployee.profilePic}
                                alt={selectedEmployee.name}
                                sx={{
                                    width: 120,
                                    height: 120,
                                    mb: 2,
                                    border: `4px solid ${getRoleColor(selectedEmployee.role)}`,
                                }}
                            >
                                {selectedEmployee.name ? selectedEmployee.name.charAt(0).toUpperCase() : <PersonIcon />}
                            </Avatar>
                            <Typography variant="h5" fontWeight="bold" align="center" gutterBottom>
                                {selectedEmployee.name}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                                <StyledChip
                                    label={selectedEmployee.role}
                                    sx={{
                                        bgcolor: alpha(getRoleColor(selectedEmployee.role), 0.1),
                                        color: getRoleColor(selectedEmployee.role),
                                        borderColor: getRoleColor(selectedEmployee.role),
                                        border: '1px solid',
                                    }}
                                />
                                <StyledChip
                                    label={selectedEmployee.status === 'active' ? 'Active' : 'Inactive'}
                                    sx={{
                                        bgcolor: alpha(getStatusColor(selectedEmployee.status), 0.1),
                                        color: getStatusColor(selectedEmployee.status),
                                        borderColor: getStatusColor(selectedEmployee.status),
                                        border: '1px solid',
                                    }}
                                />
                            </Box>
                            <Box sx={{ width: '100%', mt: 2 }}>
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    color="primary"
                                    startIcon={<MessageIcon />}
                                    onClick={() => {
                                        handleCloseViewDialog();
                                        handleMessageEmployee(selectedEmployee._id);
                                    }}
                                    sx={{ mb: 2 }}
                                >
                                    Message
                                </Button>
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    color="secondary"
                                    startIcon={<AssignmentIcon />}
                                    onClick={() => {
                                        handleCloseViewDialog();
                                        handleAssignTask(selectedEmployee._id);
                                    }}
                                >
                                    Assign Task
                                </Button>
                            </Box>
                        </Box>

                        <Box sx={{ flex: 1 }}>
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={6}>
                                    <Box>
                                        <Typography variant="subtitle2" color="text.secondary">
                                            Email
                                        </Typography>
                                        <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                                            <EmailIcon sx={{ mr: 1, fontSize: 20, color: theme.palette.primary.main }} />
                                            {selectedEmployee.email}
                                        </Typography>
                                    </Box>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <Box>
                                        <Typography variant="subtitle2" color="text.secondary">
                                            Category
                                        </Typography>
                                        <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                                            <CategoryIcon sx={{ mr: 1, fontSize: 20, color: theme.palette.primary.main }} />
                                            {selectedEmployee.category}
                                        </Typography>
                                    </Box>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <Box>
                                        <Typography variant="subtitle2" color="text.secondary">
                                            Joined Date
                                        </Typography>
                                        <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                                            <CalendarIcon sx={{ mr: 1, fontSize: 20, color: theme.palette.primary.main }} />
                                            {selectedEmployee.createdAt ? format(new Date(selectedEmployee.createdAt), 'MMMM dd, yyyy') : 'N/A'}
                                        </Typography>
                                    </Box>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <Box>
                                        <Typography variant="subtitle2" color="text.secondary">
                                            Status
                                        </Typography>
                                        <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                                            {selectedEmployee.status === 'active' ? (
                                                <CheckCircleIcon sx={{ mr: 1, fontSize: 20, color: '#4caf50' }} />
                                            ) : (
                                                <CancelIcon sx={{ mr: 1, fontSize: 20, color: '#f44336' }} />
                                            )}
                                            {selectedEmployee.status === 'active' ? 'Active' : 'Inactive'}
                                        </Typography>
                                    </Box>
                                </Grid>

                                <Grid item xs={12}>
                                    <Divider sx={{ my: 2 }} />
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            startIcon={<EditIcon />}
                                            onClick={() => {
                                                handleCloseViewDialog();
                                                handleOpenDialog(selectedEmployee);
                                            }}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            startIcon={<DeleteIcon />}
                                            onClick={() => {
                                                handleCloseViewDialog();
                                                handleDeleteEmployee(selectedEmployee._id);
                                            }}
                                        >
                                            Delete
                                        </Button>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                </DialogContent>
            </Dialog>
        );
    };

    // Render action menu
    const renderActionMenu = () => {
        return (
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                    elevation: 3,
                    sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.15))',
                        mt: 1.5,
                        borderRadius: 2,
                        minWidth: 180,
                    },
                }}
            >
                <MenuItem onClick={() => {
                    const employee = employees.find(e => e._id === selectedEmployeeId);
                    handleMenuClose();
                    handleOpenViewDialog(employee);
                }}>
                    <VisibilityIcon fontSize="small" sx={{ mr: 2 }} />
                    View Details
                </MenuItem>
                <MenuItem onClick={() => {
                    const employee = employees.find(e => e._id === selectedEmployeeId);
                    handleMenuClose();
                    handleOpenDialog(employee);
                }}>
                    <EditIcon fontSize="small" sx={{ mr: 2 }} />
                    Edit
                </MenuItem>
                <MenuItem onClick={() => {
                    handleMenuClose();
                    handleMessageEmployee(selectedEmployeeId);
                }}>
                    <MessageIcon fontSize="small" sx={{ mr: 2 }} />
                    Message
                </MenuItem>
                <MenuItem onClick={() => {
                    handleMenuClose();
                    handleAssignTask(selectedEmployeeId);
                }}>
                    <AssignmentIcon fontSize="small" sx={{ mr: 2 }} />
                    Assign Task
                </MenuItem>
                <Divider />
                <MenuItem onClick={() => {
                    handleMenuClose();
                    handleDeleteEmployee(selectedEmployeeId);
                }} sx={{ color: theme.palette.error.main }}>
                    <DeleteIcon fontSize="small" sx={{ mr: 2 }} />
                    Delete
                </MenuItem>
            </Menu>
        );
    };

    // Main render
    return (
        <Box sx={{ py: 4, px: { xs: 2, sm: 3 } }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                        Employee Management
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Manage all employees in your organization
                    </Typography>
                </Box>

                {/* Tabs */}
                <Box sx={{ mb: 4 }}>
                    <Tabs
                        value={activeTab}
                        onChange={handleTabChange}
                        variant="scrollable"
                        scrollButtons="auto"
                        sx={{
                            '& .MuiTabs-indicator': {
                                height: 3,
                                borderRadius: '3px 3px 0 0',
                            },
                        }}
                    >
                        <StyledTab
                            label="Overview"
                            icon={<DashboardIcon />}
                            iconPosition="start"
                            isDarkMode={isDarkMode}
                        />
                        <StyledTab
                            label="Employees"
                            icon={<GroupIcon />}
                            iconPosition="start"
                            isDarkMode={isDarkMode}
                        />
                    </Tabs>
                </Box>

                {/* Tab content */}
                {activeTab === 0 ? (
                    <Box>
                        {renderStatisticsCards()}
                        {renderCategoryDistribution()}
                    </Box>
                ) : (
                    <Box>
                        {renderEmployeeTable()}
                    </Box>
                )}

                {/* Dialogs */}
                {renderEmployeeDialog()}
                {renderViewEmployeeDialog()}
                {renderActionMenu()}

                {/* Snackbars */}
                <Snackbar
                    open={Boolean(error)}
                    autoHideDuration={6000}
                    onClose={() => setError(null)}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                >
                    <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
                        {error}
                    </Alert>
                </Snackbar>

                <Snackbar
                    open={Boolean(success)}
                    autoHideDuration={6000}
                    onClose={() => setSuccess(null)}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                >
                    <Alert onClose={() => setSuccess(null)} severity="success" sx={{ width: '100%' }}>
                        {success}
                    </Alert>
                </Snackbar>

                {/* Loading backdrop */}
                <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={loading}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
            </motion.div>
        </Box>
    );
};

export default Employee;
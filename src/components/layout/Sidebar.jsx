import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Collapse,
  Box,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  CalendarToday as CalendarIcon,
  Assignment as TaskIcon,
  Chat as ChatIcon,
  Person as ProfileIcon,
  Group as EmployeeIcon,
  Event as HolidayIcon,
  ExpandLess,
  ExpandMore,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';

const drawerWidth = 240;

const Sidebar = () => {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const userRole = useSelector((state) => state.auth.user?.role);

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Calendar', icon: <CalendarIcon />, path: '/calendar' },
    { text: 'Tasks', icon: <TaskIcon />, path: '/tasks' },
    { text: 'Chat', icon: <ChatIcon />, path: '/chat' },
    { text: 'Profile', icon: <ProfileIcon />, path: '/profile' },
  ];

  const adminMenuItems = [
    { text: 'Employee Management', icon: <EmployeeIcon />, path: '/admin/employees' },
    { text: 'Holiday Management', icon: <HolidayIcon />, path: '/admin/holidays' },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
    >
      <Box sx={{ overflow: 'auto', mt: 8 }}>
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                selected={location.pathname === item.path}
                onClick={() => navigate(item.path)}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}

          {userRole === 'CEO' && (
            <>
              <ListItemButton onClick={() => setOpen(!open)}>
                <ListItemIcon>
                  <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Admin" />
                {open ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
              <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {adminMenuItems.map((item) => (
                    <ListItem key={item.text} disablePadding sx={{ pl: 2 }}>
                      <ListItemButton
                        selected={location.pathname === item.path}
                        onClick={() => navigate(item.path)}
                      >
                        <ListItemIcon>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.text} />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            </>
          )}
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar; 
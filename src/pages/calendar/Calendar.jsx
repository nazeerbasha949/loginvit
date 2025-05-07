import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useContext } from 'react';
import { ThemeContext } from '../../theme/ThemeProvider';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enUS from 'date-fns/locale/en-US';
import Swal from 'sweetalert2';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './Calendar.css';
import API from '../../API';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCalendar, FiPlus, FiX, FiCheck, FiMapPin, FiUsers, FiClock, FiEdit, FiTrash2, FiInfo } from 'react-icons/fi';
import Select from 'react-select';
import { InputAdornment } from '@mui/material';
// Import MUI components
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  FormControl,
  FormControlLabel,
  Checkbox,
  InputLabel,
  Select as MuiSelect,
  Chip,
  Zoom,
  Avatar,
  IconButton,
  Fade,
  Typography,
  Box,
  Paper,
  Divider,
  Tooltip,
  Backdrop,
  Skeleton
} from '@mui/material';
import {
  CalendarMonth,
  Add,
  Close,
  Check,
  LocationOn,
  People,
  AccessTime,
  Edit,
  Delete,
  Info,
  Event as EventIcon,
  EventAvailable,
  EventBusy,
  EventNote,
  Group,
  School
} from '@mui/icons-material';
import { alpha, styled } from '@mui/material/styles';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});


// Custom styled MUI components
const StyledDialog = styled(Dialog)(({ theme, isDark }) => ({
  zIndex: 1302,
  '& .MuiDialog-paper': {
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: isDark
      ? '0 8px 32px rgba(0, 0, 0, 0.5)'
      : '0 8px 32px rgba(79, 70, 229, 0.15)',
    background: isDark
      ? 'linear-gradient(135deg, #1f2937 0%, #111827 100%)'
      : 'linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)',
    border: isDark ? '1px solid #374151' : '1px solid rgba(255, 255, 255, 0.8)',
  },
  '& .MuiBackdrop-root': {
    backdropFilter: 'blur(8px)',
    backgroundColor: isDark
      ? alpha(theme.palette.background.default, 0.8)
      : alpha(theme.palette.background.default, 0.5),
  }
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme, isDark, viewMode }) => {
  let gradientBg;

  if (viewMode === 'view') {
    gradientBg = isDark
      ? 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)'
      : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)';
  } else if (viewMode === 'edit') {
    gradientBg = isDark
      ? 'linear-gradient(135deg, #92400e 0%, #b45309 100%)'
      : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)';
  } else {
    gradientBg = isDark
      ? 'linear-gradient(135deg, #065f46 0%, #047857 100%)'
      : 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
  }
  return {
    background: gradientBg,
    color: '#ffffff',
    padding: '16px 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: isDark ? '1px solid #374151' : '1px solid rgba(255, 255, 255, 0.2)',
    '& .MuiTypography-root': {
      fontWeight: 600,
      display: 'flex',
      alignItems: 'center',
    }
  };
});

const StyledDialogContent = styled(DialogContent)(({ theme, isDark }) => ({
  padding: '24px',
  backgroundColor: isDark ? '#1f2937' : '#ffffff',
  backgroundImage: isDark
    ? 'radial-gradient(circle at 100% 100%, #2d3748 0, transparent 25%), radial-gradient(circle at 0% 0%, #2d3748 0, transparent 25%)'
    : 'radial-gradient(circle at 100% 100%, #eef2ff 0, transparent 25%), radial-gradient(circle at 0% 0%, #eef2ff 0, transparent 25%)',
  '&::-webkit-scrollbar': {
    width: '8px',
    height: '8px',
  },
  '&::-webkit-scrollbar-track': {
    background: isDark ? '#111827' : '#f1f5f9',
    borderRadius: '10px',
  },
  '&::-webkit-scrollbar-thumb': {
    background: isDark ? '#4b5563' : '#cbd5e1',
    borderRadius: '10px',
    border: isDark ? '2px solid #111827' : '2px solid #f1f5f9',
    '&:hover': {
      background: isDark ? '#6b7280' : '#94a3b8',
    }
  }
}));

const StyledDialogActions = styled(DialogActions)(({ theme, isDark }) => ({
  padding: '16px 24px',
  borderTop: isDark ? '1px solid #374151' : '1px solid #e5e7eb',
  backgroundColor: isDark ? '#1f2937' : '#ffffff',
}));

const StyledPaper = styled(Paper)(({ theme, isDark }) => ({
  backgroundColor: isDark ? alpha('#111827', 0.7) : alpha('#f9fafb', 0.7),
  backdropFilter: 'blur(8px)',
  borderRadius: '12px',
  border: isDark ? '1px solid #374151' : '1px solid #e5e7eb',
  boxShadow: isDark
    ? '0 4px 12px rgba(0, 0, 0, 0.2)'
    : '0 4px 12px rgba(0, 0, 0, 0.05)',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: isDark
      ? '0 8px 16px rgba(0, 0, 0, 0.3)'
      : '0 8px 16px rgba(0, 0, 0, 0.08)',
  }
}));

const StyledChip = styled(Chip)(({ theme, isDark, status }) => ({
  backgroundColor: status === 'active'
    ? (isDark ? alpha('#059669', 0.2) : '#ecfdf5')
    : (isDark ? alpha('#6b7280', 0.2) : '#f3f4f6'),
  color: status === 'active'
    ? (isDark ? '#34d399' : '#047857')
    : (isDark ? '#d1d5db' : '#4b5563'),
  borderRadius: '9999px',
  fontWeight: 500,
  '& .MuiChip-icon': {
    color: 'inherit',
  }
}));

const CalendarComponent = () => {
  const user = useSelector((state) => state.auth.user);
  const { isDarkMode } = useContext(ThemeContext);
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [viewMode, setViewMode] = useState('view'); // 'view', 'edit', 'create'
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    start: new Date(),
    end: new Date(new Date().getTime() + 60 * 60 * 1000), // 1 hour later
    type: 'meeting', // default type
    location: '',
    attendees: [],
  });

  // Get CEO permission from localStorage
  const isCEO = localStorage.getItem('role') === 'CEO';

  // Define theme-based text colors
  const textColors = {
    primary: isDarkMode ? '#ffffff' : '#1f2937',
    secondary: isDarkMode ? '#d1d5db' : '#4b5563',
    muted: isDarkMode ? '#9ca3af' : '#6b7280',
    accent: isDarkMode ? '#d9764a' : '#2b5a9e',
  };

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Authentication token is required');
        }

        const response = await fetch(`${API}/calendar`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }

        const data = await response.json();

        // Transform API response to calendar event format
        const formattedEvents = data.events.map(event => ({
          id: event._id,
          title: event.title,
          description: event.description || '',
          start: new Date(event.startDate),
          end: new Date(event.endDate),
          type: event.type,
          location: event.location || '',
          attendees: event.attendees || [],
          createdBy: event.createdBy,
          allDay: new Date(event.startDate).toDateString() === new Date(event.endDate).toDateString() &&
            new Date(event.startDate).getHours() === 0 &&
            new Date(event.endDate).getHours() === 0,
        }));

        setEvents(formattedEvents);
        setError(null);

        // Show success toast
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Calendar events loaded successfully',
          toast: true,
          position: 'bottom-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          background: '#f0f9ff',
          iconColor: '#4f46e5',
          customClass: {
            container: 'swal2-container-highest',
            popup: 'swal2-popup-highest'
          }
        });
      } catch (error) {
        console.error('Error fetching events:', error);
        setError(error.message);

        // Show error toast
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: `Failed to load events: ${error.message}`,
          toast: true,
          position: 'bottom-end',
          showConfirmButton: false,
          timer: 5000,
          timerProgressBar: true,
          background: '#fee2e2',
          iconColor: '#ef4444',
          customClass: {
            container: 'swal2-container-highest',
            popup: 'swal2-popup-highest'
          }
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();

    // Fetch users for the attendees dropdown
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Authentication token is required');
        }

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
          background: '#fee2e2',
          iconColor: '#ef4444'
        });
      }
    };

    if (isCEO) {
      fetchUsers();
    }
  }, [isCEO]);

  const openCreateEventDialog = () => {
    setSelectedEvent(null);
    setViewMode('create');
    setNewEvent({
      title: '',
      description: '',
      start: new Date(),
      end: new Date(new Date().getTime() + 60 * 60 * 1000), // 1 hour later
      type: 'meeting',
      location: '',
      attendees: [],
      attendeesSelection: [] // Initialize empty attendees selection
    });
    setOpenDialog(true);
  };

  const handleSelectSlot = (slotInfo) => {
    if (!isCEO) return;

    setNewEvent({
      ...newEvent,
      start: slotInfo.start,
      end: slotInfo.end,
    });
    setViewMode('create');
    setOpenDialog(true);
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setViewMode('view');
    setOpenDialog(true);
  };

  // const handleEditEvent = () => {
  //   setViewMode('edit');
  // };

  // Update the handleEditEvent function to properly format attendees for selection
  const handleEditEvent = () => {
    // Create a copy of the selected event for editing
    const eventForEdit = { ...selectedEvent };

    // Format attendees for the Select component
    if (eventForEdit.attendees && Array.isArray(eventForEdit.attendees)) {
      // Transform attendees to the format expected by react-select
      eventForEdit.attendeesSelection = eventForEdit.attendees.map(attendee => {
        // Handle both object format and ID format
        if (typeof attendee === 'object' && attendee !== null && attendee._id) {
          return {
            value: attendee._id,
            label: attendee.name || attendee.email || 'Unknown User',
            data: attendee
          };
        } else if (typeof attendee === 'string') {
          // If it's just an ID, find the user data
          const userData = users.find(user => user._id === attendee);
          return userData ? {
            value: userData._id,
            label: userData.name || userData.email || 'Unknown User',
            data: userData
          } : null;
        } else {
          console.warn('Invalid attendee format:', attendee);
          return null;
        }
      }).filter(Boolean); // Remove any null values
    } else {
      eventForEdit.attendeesSelection = [];
    }

    setSelectedEvent(eventForEdit);
    setViewMode('edit');
  };


  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedEvent(null);
    setViewMode('view');
    setNewEvent({
      title: '',
      description: '',
      start: new Date(),
      end: new Date(),
      type: 'meeting',
      location: '',
      attendees: [],
    });
  };

  const handleDeleteEvent = async () => {
    const eventId = selectedEvent.id;

    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
      background: 'rgba(255, 255, 255, 0.9)',
      backdrop: 'rgba(0, 0, 0, 0.4)',
      customClass: {
        confirmButton: 'btn-delete',
        cancelButton: 'btn-cancel',
        container: 'swal2-container-highest',
        popup: 'swal2-popup-highest'
      },
      zIndex: 9999
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            throw new Error('Authentication token is required');
          }

          const response = await fetch(`${API}/calendar/${eventId}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          if (!response.ok) {
            throw new Error('Failed to delete event');
          }

          await response.json();

          // Remove event from state
          setEvents(events.filter(event => event.id !== eventId));

          handleCloseDialog();

          Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: 'The event has been deleted.',
            toast: true,
            position: 'bottom-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            background: '#f0f9ff',
            iconColor: '#10b981',
            customClass: {
              container: 'swal2-container-highest',
              popup: 'swal2-popup-highest'
            },
            zIndex: 9999
          });
        } catch (error) {
          console.error('Error deleting event:', error);

          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: `Failed to delete event: ${error.message}`,
            toast: true,
            position: 'bottom-end',
            showConfirmButton: false,
            timer: 5000,
            timerProgressBar: true,
            background: '#fee2e2',
            iconColor: '#ef4444'
          });
        }
      }
    });
  };

  const handleSaveEvent = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token is required');
      }

      // Show loading state with highest z-index
      Swal.fire({
        title: 'Saving...',
        text: 'Please wait while we save your event',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
        background: isDarkMode ? 'rgba(31, 41, 55, 0.9)' : 'rgba(255, 255, 255, 0.9)',
        customClass: {
          container: 'swal2-container-highest',
          popup: 'swal2-popup-highest'
        },
        zIndex: 9999
      });

      // Prepare event data for API
      let eventData;

      if (viewMode === 'edit') {
        eventData = {
          title: selectedEvent.title,
          description: selectedEvent.description || '',
          startDate: selectedEvent.start,
          endDate: selectedEvent.end,
          type: selectedEvent.type || 'meeting',
          location: selectedEvent.location || '',
          // Extract just the IDs from the attendees selection
          attendees: selectedEvent.attendeesSelection
            ? selectedEvent.attendeesSelection.map(option => option.value)
            : []
        };
        // Update existing event
        const response = await fetch(`${API}/calendar/${selectedEvent.id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(eventData)
        });

        if (!response.ok) {
          throw new Error('Failed to update event');
        }

        const data = await response.json();

        setEvents(events.map(event =>
          event.id === selectedEvent.id
            ? {
              ...event,
              title: eventData.title,
              description: eventData.description,
              start: new Date(eventData.startDate),
              end: new Date(eventData.endDate),
              type: eventData.type,
              location: eventData.location,
              attendees: eventData.attendees
            }
            : event
        ));

        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Event updated successfully',
          toast: true,
          position: 'bottom-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          background: '#f0f9ff',
          iconColor: '#10b981'
        });
      } else {

        eventData = {
          title: newEvent.title,
          description: newEvent.description || '',
          startDate: newEvent.start,
          endDate: newEvent.end,
          type: newEvent.type || 'meeting',
          location: newEvent.location || '',
          // Extract just the IDs from the attendees selection
          attendees: newEvent.attendeesSelection
            ? newEvent.attendeesSelection.map(option => option.value)
            : []
        };

        // Create new event
        const response = await fetch(`${API}/calendar`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(eventData)
        });

        if (!response.ok) {
          throw new Error('Failed to create event');
        }

        const data = await response.json();

        // Add new event to the list
        const newEventWithId = {
          id: data.event._id,
          title: eventData.title,
          description: eventData.description,
          start: new Date(eventData.startDate),
          end: new Date(eventData.endDate),
          type: eventData.type,
          location: eventData.location,
          attendees: eventData.attendees,
          createdBy: data.event.createdBy
        };

        setEvents([...events, newEventWithId]);

        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Event created successfully',
          toast: true,
          position: 'bottom-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          background: '#f0f9ff',
          iconColor: '#10b981'
        });
      }

      handleCloseDialog();
    } catch (error) {
      console.error('Error saving event:', error);

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `Failed to save event: ${error.message}`,
        toast: true,
        position: 'bottom-end',
        showConfirmButton: false,
        timer: 5000,
        timerProgressBar: true,
        background: '#fee2e2',
        iconColor: '#ef4444'
      });
    }
  };

  const eventStyleGetter = (event) => {
    let backgroundColor, borderColor, textColor, className, backgroundGradient;

    // Define colors based on theme and event type
    switch (event.type) {
      case 'meeting':
        backgroundColor = isDarkMode ? '#4338ca' : '#4f46e5'; // darker indigo for dark mode
        borderColor = isDarkMode ? '#3730a3' : '#4338ca';
        className = 'event-meeting';
        backgroundGradient = isDarkMode
          ? 'linear-gradient(135deg, #3730a3, #4338ca)'
          : 'linear-gradient(135deg, #4338ca, #6366f1)';
        break;
      case 'holiday':
        backgroundColor = isDarkMode ? '#b91c1c' : '#ef4444'; // darker red for dark mode
        borderColor = isDarkMode ? '#991b1b' : '#b91c1c';
        className = 'event-holiday';
        backgroundGradient = isDarkMode
          ? 'linear-gradient(135deg, #991b1b, #b91c1c)'
          : 'linear-gradient(135deg, #ef4444, #f87171)';
        break;
      case 'deadline':
        backgroundColor = isDarkMode ? '#b45309' : '#f59e0b'; // darker amber for dark mode
        borderColor = isDarkMode ? '#92400e' : '#d97706';
        className = 'event-deadline';
        backgroundGradient = isDarkMode
          ? 'linear-gradient(135deg, #92400e, #b45309)'
          : 'linear-gradient(135deg, #f59e0b, #fbbf24)';
        break;
      case 'event':
        backgroundColor = isDarkMode ? '#7c3aed' : '#8b5cf6'; // darker purple for dark mode
        borderColor = isDarkMode ? '#6d28d9' : '#7c3aed';
        className = 'event-event';
        backgroundGradient = isDarkMode
          ? 'linear-gradient(135deg, #6d28d9, #7c3aed)'
          : 'linear-gradient(135deg, #8b5cf6, #a78bfa)';
        break;
      case 'training':
        backgroundColor = isDarkMode ? '#059669' : '#10b981'; // darker emerald for dark mode
        borderColor = isDarkMode ? '#047857' : '#059669';
        className = 'event-training';
        backgroundGradient = isDarkMode
          ? 'linear-gradient(135deg, #047857, #059669)'
          : 'linear-gradient(135deg, #10b981, #34d399)';
        break;
      default:
        backgroundColor = isDarkMode ? '#4338ca' : '#4f46e5'; // default to indigo
        borderColor = isDarkMode ? '#3730a3' : '#4338ca';
        className = 'event-default';
        backgroundGradient = isDarkMode
          ? 'linear-gradient(135deg, #3730a3, #4338ca)'
          : 'linear-gradient(135deg, #4338ca, #6366f1)';
    }

    const style = {
      backgroundColor: backgroundColor,
      borderRadius: '6px',
      opacity: 0.9,
      color: '#ffffff', // White text works well on all colored backgrounds
      border: 'none',
      display: 'block',
      padding: '4px 8px',
      boxShadow: isDarkMode
        ? '0 2px 4px rgba(0, 0, 0, 0.3)'
        : '0 2px 4px rgba(0, 0, 0, 0.1)',
      background: backgroundGradient
    };

    return {
      style,
      className
    };
  };

  const customComponents = {
    event: (props) => (
      <Tooltip
        title={
          <div>
            <div style={{ fontWeight: 'bold', color: textColors.primary }}>{props.event.title}</div>
            {props.event.description && (
              <div style={{ color: textColors.secondary, marginTop: '4px' }}>{props.event.description}</div>
            )}
            {props.event.location && (
              <div style={{ color: textColors.muted, marginTop: '4px' }}>
                <FiMapPin style={{ display: 'inline', marginRight: '4px' }} />
                {props.event.location}
              </div>
            )}
          </div>
        }
        placement="top"
        arrow
      >
        <div className="event-container" style={{ overflow: 'hidden' }}>
          <div className="event-title" style={{ color: eventStyleGetter(props.event).style.color }}>
            {props.event.title}
          </div>
          {props.event.location && (
            <div className="event-location" style={{ color: eventStyleGetter(props.event).style.color, opacity: 0.8 }}>
              <FiMapPin style={{ display: 'inline', marginRight: '4px', fontSize: '0.75rem' }} />
              {props.event.location}
            </div>
          )}
        </div>
      </Tooltip>
    ),
  };

  // Update the event type options in the form
  const eventTypeOptions = [
    { value: 'meeting', label: 'Meeting', icon: <EventIcon className="mr-2" /> },
    { value: 'deadline', label: 'Deadline', icon: <EventBusy className="mr-2" /> },
    { value: 'holiday', label: 'Holiday', icon: <EventAvailable className="mr-2" /> },
    { value: 'event', label: 'Event', icon: <EventNote className="mr-2" /> },
    { value: 'training', label: 'Training', icon: <School className="mr-2" /> }
  ];

  const getEventTypeIcon = (type) => {
    switch (type) {
      case 'meeting':
        return <EventIcon fontSize="small" />;
      case 'deadline':
        return <EventBusy fontSize="small" />;
      case 'holiday':
        return <EventAvailable fontSize="small" />;
      case 'event':
        return <EventNote fontSize="small" />;
      case 'training':
        return <School fontSize="small" />;
      default:
        return <EventIcon fontSize="small" />;
    }
  };

  // Update the getEventColor function to handle all event types
  const getEventColor = (type) => {
    switch (type) {
      case 'meeting':
        return '#4f46e5'; // indigo
      case 'deadline':
        return '#f59e0b'; // amber
      case 'holiday':
        return '#ef4444'; // red
      case 'event':
        return '#8b5cf6'; // purple
      case 'training':
        return '#10b981'; // emerald
      default:
        return '#4f46e5'; // default to indigo
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50">
        <div className="loading-spinner mb-4"></div>
        <h2 className="text-xl font-semibold text-indigo-600 animate-pulse">
          Loading your calendar...
        </h2>
        <p className="text-gray-500 mt-2">Please wait while we fetch your events</p>
      </div>
    );
  }

  // Create options for Select dropdown from users
  const userOptions = users.map(user => ({
    value: user._id,
    label: user.name,
    category: user.category,
    role: user.role,
    status: user.status
  }));

  // Group options by category
  const groupedOptions = userOptions.reduce((groups, option) => {
    const category = option.category || 'Other';
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(option);
    return groups;
  }, {});

  const selectOptions = Object.keys(groupedOptions).map(groupKey => ({
    label: groupKey,
    options: groupedOptions[groupKey]
  }));

  // Get event type color
  const getEventTypeColor = (type) => {
    switch (type) {
      case 'meeting':
        return 'indigo';
      case 'holiday':
        return 'red';
      case 'deadline':
        return 'amber';
      case 'event':
        return 'purple';
      case 'training':
        return 'emerald';
      default:
        return 'blue';
    }
  };

  return (
    <div className="calendar-container mx-auto px-4 py-6 animate-fade-in"
      style={{ color: textColors.primary, backgroundColor: isDarkMode ? '#1f2937' : '#ffffff' }}>
      <div className="page-header mb-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          <h1 className="page-title text-4xl font-bold mb-4 md:mb-0"
            style={{ color: textColors.accent }}>
            <FiCalendar className="inline mr-3" />
            Company Calendar
          </h1>

          <div className="flex flex-wrap gap-4">
            <span className="badge px-3 py-1.5 rounded-full text-sm flex items-center shadow-sm"
              style={{
                background: isDarkMode ? '#374151' : 'linear-gradient(to right, #4f46e5, #6366f1)',
                color: isDarkMode ? '#d1d5db' : 'white'
              }}>
              <span className="w-3 h-3 rounded-full bg-white mr-2"></span>
              Meetings
            </span>
            <span className="badge px-3 py-1.5 rounded-full text-sm flex items-center shadow-sm"
              style={{
                background: isDarkMode ? '#374151' : 'linear-gradient(to right, #4f46e5, #6366f1)',
                color: isDarkMode ? '#d1d5db' : 'white'
              }}>
              <span className="w-3 h-3 rounded-full bg-white mr-2"></span>
              Events
            </span>
            <span className="badge px-3 py-1.5 rounded-full text-sm flex items-center shadow-sm"
              style={{
                background: isDarkMode ? '#374151' : 'linear-gradient(to right, #4f46e5, #6366f1)',
                color: isDarkMode ? '#d1d5db' : 'white'
              }}>
              <span className="w-3 h-3 rounded-full bg-white mr-2"></span>
              Holidays
            </span>
            <span className="badge px-3 py-1.5 rounded-full text-sm flex items-center shadow-sm"
              style={{
                background: isDarkMode ? '#374151' : 'linear-gradient(to right, #4f46e5, #6366f1)',
                color: isDarkMode ? '#d1d5db' : 'white'
              }}>
              <span className="w-3 h-3 rounded-full bg-white mr-2"></span>
              Deadlines
            </span>
            <span className="badge px-3 py-1.5 rounded-full text-sm flex items-center shadow-sm"
              style={{
                background: isDarkMode ? '#374151' : 'linear-gradient(to right, #4f46e5, #6366f1)',
                color: isDarkMode ? '#d1d5db' : 'white'
              }}>
              <span className="w-3 h-3 rounded-full bg-white mr-2"></span>
              Training
            </span>
          </div>
        </div>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-l-4 p-4 mb-6 rounded-lg shadow-md"
          style={{
            backgroundColor: isDarkMode ? '#4c1d24' : '#fee2e2',
            borderColor: isDarkMode ? '#ef4444' : '#f87171',
            color: isDarkMode ? '#fca5a5' : '#b91c1c'
          }}
          role="alert"
        >
          <div className="flex items-center">
            <div className="py-1 text-red-500">
              <svg className="w-6 h-6 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="font-bold">Error Fetching Calendar Events</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="card rounded-xl overflow-hidden border"
        style={{
          backgroundColor: isDarkMode ? '#111827' : 'white',
          borderColor: isDarkMode ? '#374151' : '#e5e7eb',
          boxShadow: isDarkMode ? '0 4px 20px rgba(0, 0, 0, 0.3)' : '0 4px 20px rgba(0, 0, 0, 0.08)'
        }}
      >
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{
            height: 'calc(100vh - 200px)',
            backgroundColor: isDarkMode ? 'rgba(17, 24, 39, 0.7)' : 'rgba(255, 255, 255, 0.8)',
            color: textColors.primary,
            borderRadius: '12px',
            padding: '16px',
            boxShadow: isDarkMode
              ? '0 4px 20px rgba(0, 0, 0, 0.2)'
              : '0 4px 20px rgba(0, 0, 0, 0.08)'
          }}
          onSelectEvent={handleSelectEvent}
          onSelectSlot={handleSelectSlot}
          selectable={isCEO}
          eventPropGetter={eventStyleGetter}
          className={`calendar-component ${isDarkMode ? 'dark-theme' : 'light-theme'}`}
          components={{
            toolbar: (toolbarProps) => (
              <div className="rbc-toolbar" style={{
                backgroundColor: isDarkMode ? '#1f2937' : '#f9fafb',
                borderBottom: isDarkMode ? '1px solid #374151' : '1px solid #e5e7eb',
                color: textColors.primary
              }}>
                <span className="rbc-btn-group">
                  {toolbarProps.views.map(view => (
                    <button
                      key={view}
                      type="button"
                      onClick={() => toolbarProps.onView(view)}
                      className={`view-btn ${view === toolbarProps.view ? 'active' : ''}`}
                      style={{
                        backgroundColor: view === toolbarProps.view
                          ? (isDarkMode ? '#374151' : '#eef2ff')
                          : (isDarkMode ? '#1f2937' : '#f9fafb'),
                        color: view === toolbarProps.view
                          ? (isDarkMode ? '#ffffff' : '#4f46e5')
                          : textColors.secondary,
                        borderColor: isDarkMode ? '#374151' : '#e5e7eb'
                      }}
                    >
                      {view.charAt(0).toUpperCase() + view.slice(1)}
                    </button>
                  ))}
                </span>
                <span className="rbc-toolbar-label" style={{ color: textColors.primary, fontWeight: 600 }}>
                  {toolbarProps.label}
                </span>
                <span className="rbc-btn-group">
                  <button
                    type="button"
                    onClick={() => toolbarProps.onNavigate('PREV')}
                    className="toolbar-btn"
                    style={{
                      backgroundColor: isDarkMode ? '#1f2937' : '#f9fafb',
                      color: textColors.secondary,
                      borderColor: isDarkMode ? '#374151' : '#e5e7eb'
                    }}
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => toolbarProps.onNavigate('TODAY')}
                    className="toolbar-btn"
                    style={{
                      backgroundColor: isDarkMode ? '#374151' : '#eef2ff',
                      color: isDarkMode ? '#ffffff' : '#4f46e5',
                      borderColor: isDarkMode ? '#4b5563' : '#c7d2fe'
                    }}
                  >
                    Today
                  </button>
                  <button
                    type="button"
                    onClick={() => toolbarProps.onNavigate('NEXT')}
                    className="toolbar-btn"
                    style={{
                      backgroundColor: isDarkMode ? '#1f2937' : '#f9fafb',
                      color: textColors.secondary,
                      borderColor: isDarkMode ? '#374151' : '#e5e7eb'
                    }}
                  >
                    Next
                  </button>
                </span>
              </div>
            )
          }}
        />
      </motion.div>

      {/* Use StyledDialog instead of regular Dialog for enhanced appearance */}
      <StyledDialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        TransitionComponent={Zoom}
        TransitionProps={{ timeout: 400 }}
        BackdropProps={{
          timeout: 500,
          style: {
            backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(4px)'
          }
        }}
        PaperProps={{
          style: {
            backgroundColor: isDarkMode ? '#1f2937' : 'white',
            color: textColors.primary,
            background: isDarkMode ? '#1f2937' : 'linear-gradient(to bottom, #ffffff, #f9fafb)',
          }
        }}
      >
        {/* Dialog Title with theme-aware styling */}
        <StyledDialogTitle isDark={isDarkMode} viewMode={viewMode}>
          <Typography variant="h5" component="div" className="flex items-center font-bold">
            {viewMode === 'view' ? (
              <>
                <motion.div
                  initial={{ rotate: -10, scale: 0.9 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <FiInfo className="pr-2 items-center" size={20} sx={{ marginRight: '20px' }} />
                </motion.div>
                Event Details
              </>
            ) : viewMode === 'edit' ? (
              <>
                <motion.div
                  initial={{ rotate: -10, scale: 0.9 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <FiEdit className="mr-3" size={24} />
                </motion.div>
                Edit Event
              </>
            ) : (
              <>
                <motion.div
                  initial={{ rotate: -10, scale: 0.9 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <FiPlus className="mr-3" size={24} />
                </motion.div>
                Create New Event
              </>
            )}
          </Typography>
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleCloseDialog}
            aria-label="close"
            className="hover:bg-white/20 rounded-full"
          >
            <FiX size={24} />
          </IconButton>
        </StyledDialogTitle>

        {/* Dialog Content with enhanced styling */}
        <StyledDialogContent
          className="max-h-[70vh] overflow-y-auto"
          isDark={isDarkMode}
          sx={{
            padding: '24px',
            '& > div': {
              marginBottom: '24px',
            },
            '& .MuiTextField-root': {
              marginBottom: '16px',
            },
            '& .MuiFormControl-root': {
              marginBottom: '20px',
            },
            '& .MuiBox-root': {
              marginBottom: '24px',
            },
            '& .MuiTypography-root': {
              marginBottom: '12px',
            }
          }}
        >
          {viewMode === 'view' ? (
            /* View mode with enhanced animations and styling */
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              <Box className="relative">
                <motion.div
                  initial={{ y: -20 }}
                  animate={{ y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="absolute -top-12 -right-6 w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 blur-xl"
                />

                <Typography
                  variant="h3"
                  component="h3"
                  className="font-bold relative"
                  style={{
                    color: textColors.primary,
                    background: isDarkMode ?
                      'linear-gradient(to right, #c084fc, #818cf8)' :
                      'linear-gradient(to right, #4f46e5, #6366f1)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}
                >
                  {selectedEvent?.title}
                </Typography>

                <Box className="flex items-center mt-3 space-x-3">
                  <StyledChip
                    icon={getEventTypeIcon(selectedEvent?.type)}
                    label={selectedEvent?.type}
                    isDark={isDarkMode}
                    status="active"
                    className="capitalize"
                  />
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className={`h-2 w-2 rounded-full ${selectedEvent?.type === 'meeting' ? 'bg-indigo-500' :
                      selectedEvent?.type === 'holiday' ? 'bg-red-500' :
                        selectedEvent?.type === 'deadline' ? 'bg-amber-500' :
                          selectedEvent?.type === 'event' ? 'bg-purple-500' :
                            'bg-emerald-500'
                      }`}
                  />
                </Box>
              </Box>

              {selectedEvent?.description && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="relative"
                >
                  <StyledPaper
                    elevation={0}
                    className="p-6 rounded-xl backdrop-blur-sm"
                    isDark={isDarkMode}
                    style={{
                      padding: '20px',
                      borderRadius: '15px',
                      background: isDarkMode ?
                        'linear-gradient(135deg, rgba(79, 70, 229, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%)' :
                        'linear-gradient(135deg, rgba(79, 70, 229, 0.05) 0%, rgba(147, 51, 234, 0.05) 100%)'
                    }}
                  >
                    <Typography variant="subtitle1" className="font-medium mb-3" style={{ color: textColors.secondary }}>
                      Description
                    </Typography>
                    <Typography variant="body1" style={{ color: textColors.primary, lineHeight: 1.8 }}>
                      {selectedEvent?.description}
                    </Typography>
                  </StyledPaper>
                </motion.div>
              )}

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Box className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <StyledPaper
                    elevation={0}
                    className="p-4 rounded-xl"
                    isDark={isDarkMode}
                    style={{
                      padding: '20px',
                      borderRadius: '15px',
                      background: isDarkMode ?
                        'linear-gradient(135deg, rgba(79, 70, 229, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%)' :
                        'linear-gradient(135deg, rgba(79, 70, 229, 0.05) 0%, rgba(147, 51, 234, 0.05) 100%)'
                    }}
                  >
                    <Box className="flex items-center space-x-3 mb-3">
                      <div className="p-2 rounded-lg bg-indigo-500/10">
                        <FiClock className="text-indigo-500" size={20} />
                      </div>
                      <Typography variant="subtitle1" className="font-medium" style={{ color: textColors.secondary }}>
                        Start Time
                      </Typography>
                    </Box>
                    <Typography variant="body1" style={{ color: textColors.primary }}>
                      {selectedEvent && format(selectedEvent.start, 'PPpp')}
                    </Typography>
                  </StyledPaper>

                  <StyledPaper
                    elevation={0}
                    className="p-4 rounded-xl"
                    isDark={isDarkMode}
                    style={{
                      padding: '20px',
                      borderRadius: '15px',
                      background: isDarkMode ?
                        'linear-gradient(135deg, rgba(79, 70, 229, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%)' :
                        'linear-gradient(135deg, rgba(79, 70, 229, 0.05) 0%, rgba(147, 51, 234, 0.05) 100%)'
                    }}
                  >
                    <Box className="flex items-center space-x-3 mb-3">
                      <div className="p-2 rounded-lg bg-purple-500/10">
                        <FiClock className="text-purple-500" size={20} />
                      </div>
                      <Typography variant="subtitle1" className="font-medium" style={{ color: textColors.secondary }}>
                        End Time
                      </Typography>
                    </Box>
                    <Typography variant="body1" style={{ color: textColors.primary }}>
                      {selectedEvent && format(selectedEvent.end, 'PPpp')}
                    </Typography>
                  </StyledPaper>
                </Box>
              </motion.div>

              {selectedEvent?.location && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <StyledPaper
                    elevation={0}
                    className="p-4 rounded-xl"
                    isDark={isDarkMode}
                    style={{
                      padding: '20px',
                      borderRadius: '15px',
                      background: isDarkMode ?
                        'linear-gradient(135deg, rgba(79, 70, 229, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%)' :
                        'linear-gradient(135deg, rgba(79, 70, 229, 0.05) 0%, rgba(147, 51, 234, 0.05) 100%)'
                    }}
                  >
                    <Box className="flex items-center space-x-3 mb-3">
                      <div className="p-2 rounded-lg bg-emerald-500/10">
                        <FiMapPin className="text-emerald-500" size={20} />
                      </div>
                      <Typography variant="subtitle1" className="font-medium" style={{ color: textColors.secondary }}>
                        Location
                      </Typography>
                    </Box>
                    <Typography variant="body1" style={{ color: textColors.primary }}>
                      {selectedEvent.location}
                    </Typography>
                  </StyledPaper>
                </motion.div>
              )}

              {selectedEvent?.attendees && Array.isArray(selectedEvent.attendees) && selectedEvent.attendees.length > 0 && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <StyledPaper
                    elevation={0}
                    className="p-6 rounded-xl"
                    isDark={isDarkMode}
                  >
                    <Box className="flex items-center space-x-3 mb-4">
                      <div className="p-2 rounded-lg bg-blue-500/10">
                        <FiUsers className="text-blue-500" size={20} />
                      </div>
                      <Typography variant="subtitle1" className="font-medium" style={{ color: textColors.secondary }}>
                        Attendees
                      </Typography>
                    </Box>
                    <Box className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {selectedEvent.attendees.map((attendee, index) => {
                        // Handle both formats: object with properties or just ID
                        const attendeeData = typeof attendee === 'object' && attendee !== null
                          ? attendee
                          : users.find(user => user._id === attendee);

                        return (
                          <motion.div
                            key={attendeeData?._id || `attendee-${index}`}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.1 * index }}
                          >
                            <Box
                              className="flex items-center p-3 rounded-lg space-x-3"
                              style={{
                                background: isDarkMode ? 'rgba(55, 65, 81, 0.5)' : 'rgba(243, 244, 246, 0.5)',
                                backdropFilter: 'blur(8px)'
                              }}
                            >
                              <Avatar
                                sx={{
                                  bgcolor: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
                                  width: 32,
                                  height: 32
                                }}
                              >
                                {attendeeData?.name?.charAt(0) || '?'}
                              </Avatar>
                              <Box>
                                <Typography variant="subtitle2" style={{ color: textColors.primary }}>
                                  {attendeeData?.name || 'Unknown User'}
                                </Typography>
                                <Typography variant="caption" style={{ color: textColors.muted }}>
                                  {attendeeData?.email || attendeeData?.role || ''}
                                </Typography>
                              </Box>
                              {attendeeData?.status && (
                                <Box
                                  className="ml-auto px-2 py-1 rounded-full text-xs"
                                  style={{
                                    background: attendeeData.status === 'active' ?
                                      (isDarkMode ? 'rgba(16, 185, 129, 0.2)' : 'rgba(16, 185, 129, 0.1)') :
                                      (isDarkMode ? 'rgba(107, 114, 128, 0.2)' : 'rgba(107, 114, 128, 0.1)'),
                                    color: attendeeData.status === 'active' ?
                                      (isDarkMode ? '#34d399' : '#059669') :
                                      (isDarkMode ? '#9ca3af' : '#6b7280')
                                  }}
                                >
                                  {attendeeData.status}
                                </Box>
                              )}
                            </Box>
                          </motion.div>
                        );
                      })}
                    </Box>
                  </StyledPaper>
                </motion.div>
              )}
            </motion.div>

          ) : (
            /* Edit or Create mode with enhanced form styling */
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="space-y-5"
            >
              <FormControl component="fieldset" fullWidth>
                <Typography variant="subtitle2" className="mb-2 flex items-center" style={{ color: textColors.secondary }}>
                  <FiUsers className="mr-2" /> Select Attendees
                </Typography>
                <Box className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {users.map((user) => (
                    <motion.div
                      key={user._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={
                              viewMode === 'edit'
                                ? selectedEvent?.attendees?.includes(user._id)
                                : newEvent.attendees?.includes(user._id)
                            }
                            onChange={(e) => {
                              const attendees = viewMode === 'edit'
                                ? [...(selectedEvent?.attendees || [])]
                                : [...(newEvent.attendees || [])];

                              if (e.target.checked) {
                                attendees.push(user._id);
                              } else {
                                const index = attendees.indexOf(user._id);
                                if (index > -1) {
                                  attendees.splice(index, 1);
                                }
                              }

                              if (viewMode === 'edit') {
                                
                                setSelectedEvent({ ...selectedEvent, attendees });
                              } else {
                                setNewEvent({ ...newEvent, attendees });
                              }
                            }}
                            sx={{
                              color: isDarkMode ? '#4b5563' : '#d1d5db',
                              '&.Mui-checked': {
                                color: textColors.accent,
                              },
                            }}
                          />
                        }
                        label={
                          <Box className="flex items-center justify-between w-full">
                            <Typography style={{ color: textColors.primary }}>
                              {user.name}
                            </Typography>
                            <Chip
                              size="small"
                              label={user.role}
                              className={`ml-2 ${user.status === 'active'
                                ? isDarkMode
                                  ? 'bg-green-900 text-green-300'
                                  : 'bg-green-100 text-green-800'
                                : isDarkMode
                                  ? 'bg-gray-800 text-gray-300'
                                  : 'bg-gray-100 text-gray-800'
                                }`}
                            />
                          </Box>
                        }
                        className="w-full p-2 rounded-lg hover:bg-opacity-10 hover:bg-gray-500 transition-colors"
                        style={{
                          backgroundColor: isDarkMode ? 'rgba(55, 65, 81, 0.1)' : 'rgba(243, 244, 246, 0.5)',
                          margin: 0,
                        }}
                      />
                    </motion.div>
                  ))}
                </Box>
              </FormControl>
              <TextField
                label="Title"
                variant="outlined"
                fullWidth
                required
                placeholder="Enter event title"
                value={viewMode === 'edit' ? selectedEvent?.title : newEvent.title}
                onChange={(e) =>
                  viewMode === 'edit'
                    ? setSelectedEvent({ ...selectedEvent, title: e.target.value })
                    : setNewEvent({ ...newEvent, title: e.target.value })
                }
                InputProps={{
                  className: "rounded-lg",
                  style: { color: textColors.primary }
                }}
                InputLabelProps={{
                  style: { color: textColors.secondary }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: isDarkMode ? '#4b5563' : '#e5e7eb',
                      borderRadius: '12px',
                      transition: 'all 0.2s ease',
                    },
                    '&:hover fieldset': {
                      borderColor: isDarkMode ? '#6b7280' : '#d1d5db',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: textColors.accent,
                      borderWidth: '2px',
                    },
                  },
                }}
              />

              <TextField
                label="Description"
                variant="outlined"
                fullWidth
                multiline
                rows={3}
                placeholder="Event description"
                value={viewMode === 'edit' ? selectedEvent?.description || '' : newEvent.description}
                onChange={(e) =>
                  viewMode === 'edit'
                    ? setSelectedEvent({ ...selectedEvent, description: e.target.value })
                    : setNewEvent({ ...newEvent, description: e.target.value })
                }
                InputProps={{
                  className: "rounded-lg",
                  style: { color: textColors.primary }
                }}
                InputLabelProps={{
                  style: { color: textColors.secondary }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: isDarkMode ? '#4b5563' : '#e5e7eb',
                      borderRadius: '12px',
                    },
                    '&:hover fieldset': {
                      borderColor: isDarkMode ? '#6b7280' : '#d1d5db',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: textColors.accent,
                      borderWidth: '2px',
                    },
                  },
                }}
              />

              <Box className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <TextField
                  label="Location"
                  variant="outlined"
                  fullWidth
                  placeholder="Enter location"
                  value={viewMode === 'edit' ? selectedEvent?.location || '' : newEvent.location}
                  onChange={(e) =>
                    viewMode === 'edit'
                      ? setSelectedEvent({ ...selectedEvent, location: e.target.value })
                      : setNewEvent({ ...newEvent, location: e.target.value })
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FiMapPin style={{ color: textColors.muted }} />
                      </InputAdornment>
                    ),
                    className: "rounded-lg",
                    style: { color: textColors.primary }
                  }}
                  InputLabelProps={{
                    style: { color: textColors.secondary }
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: isDarkMode ? '#4b5563' : '#e5e7eb',
                        borderRadius: '12px',
                      },
                      '&:hover fieldset': {
                        borderColor: isDarkMode ? '#6b7280' : '#d1d5db',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: textColors.accent,
                        borderWidth: '2px',
                      },
                    },
                  }}
                />

                <FormControl fullWidth className="mb-4">
                  <InputLabel id="event-type-label">Event Type</InputLabel>
                  <MuiSelect
                    labelId="event-type-label"
                    id="event-type"
                    value={viewMode === 'edit' ? selectedEvent?.type : newEvent.type}
                    onChange={(e) =>
                      viewMode === 'edit'
                        ? setSelectedEvent({ ...selectedEvent, type: e.target.value })
                        : setNewEvent({ ...newEvent, type: e.target.value })
                    }
                    label="Event Type"
                    className="rounded-lg"
                    sx={{
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: isDarkMode ? '#4b5563' : '#e5e7eb',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: isDarkMode ? '#6b7280' : '#d1d5db',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: textColors.accent,
                      },
                      color: textColors.primary
                    }}
                  >
                    {eventTypeOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        <Box className="flex items-center">
                          {React.cloneElement(option.icon, {
                            style: {
                              color: getEventColor(option.value),
                              marginRight: '8px'
                            }
                          })}
                          {option.label}
                        </Box>
                      </MenuItem>
                    ))}
                  </MuiSelect>
                </FormControl>
              </Box>

              <StyledPaper elevation={0} className="rounded-lg p-4" isDark={isDarkMode}>
                <Box className="flex items-center mb-3">
                  <FiClock style={{ color: isDarkMode ? '#d1d5db' : '#4b5563' }} className="mr-2" size={18} />
                  <Typography variant="subtitle1" className="font-medium" style={{ color: isDarkMode ? '#d1d5db' : '#4b5563' }}>
                    Time & Date
                  </Typography>
                </Box>

                <Box className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <TextField
                    label="Start"
                    type="datetime-local"
                    variant="outlined"
                    fullWidth
                    required
                    InputLabelProps={{
                      shrink: true,
                      style: { color: textColors.secondary }
                    }}
                    value={format(
                      viewMode === 'edit' ? selectedEvent?.start : newEvent.start,
                      "yyyy-MM-dd'T'HH:mm"
                    )}
                    onChange={(e) => {
                      const date = new Date(e.target.value);
                      if (viewMode === 'edit') {
                        setSelectedEvent({ ...selectedEvent, start: date });
                      } else {
                        setNewEvent({ ...newEvent, start: date });
                      }
                    }}
                    InputProps={{
                      className: "rounded-lg",
                      style: { color: textColors.primary }
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: isDarkMode ? '#4b5563' : '#e5e7eb',
                          borderRadius: '12px',
                        },
                        '&:hover fieldset': {
                          borderColor: isDarkMode ? '#6b7280' : '#d1d5db',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: textColors.accent,
                          borderWidth: '2px',
                        },
                      },
                    }}
                  />

                  <TextField
                    label="End"
                    type="datetime-local"
                    variant="outlined"
                    fullWidth
                    required
                    InputLabelProps={{
                      shrink: true,
                      style: { color: textColors.secondary }
                    }}
                    value={format(
                      viewMode === 'edit' ? selectedEvent?.end : newEvent.end,
                      "yyyy-MM-dd'T'HH:mm"
                    )}
                    onChange={(e) => {
                      const date = new Date(e.target.value);
                      if (viewMode === 'edit') {
                        setSelectedEvent({ ...selectedEvent, end: date });
                      } else {
                        setNewEvent({ ...newEvent, end: date });
                      }
                    }}
                    InputProps={{
                      className: "rounded-lg",
                      style: { color: textColors.primary }
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: isDarkMode ? '#4b5563' : '#e5e7eb',
                          borderRadius: '12px',
                        },
                        '&:hover fieldset': {
                          borderColor: isDarkMode ? '#6b7280' : '#d1d5db',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: textColors.accent,
                          borderWidth: '2px',
                        },
                      },
                    }}
                  />
                </Box>
              </StyledPaper>

              <FormControl fullWidth variant="outlined">
                <Typography variant="subtitle2" className="mb-2 flex items-center" style={{ color: textColors.secondary }}>
                  <FiUsers className="mr-2" /> Attendees
                </Typography>
                <Select
                  isMulti
                  name="attendees"
                  options={selectOptions}
                  className="react-select-container"
                  classNamePrefix="react-select"
                  placeholder="Select attendees..."
                  value={userOptions.filter(option =>
                    (viewMode === 'edit'
                      ? selectedEvent?.attendees
                      : newEvent.attendees).includes(option.value)
                  )}
                  onChange={(selectedOptions) => {
                    const selectedIds = selectedOptions ? selectedOptions.map(option => option.value) : [];
                    if (viewMode === 'edit') {
                      setSelectedEvent({ ...selectedEvent, attendees: selectedIds });
                    } else {
                      setNewEvent({ ...newEvent, attendees: selectedIds });
                    }
                  }}
                  formatOptionLabel={option => (
                    <div className="flex items-center justify-between">
                      <div>{option.label}</div>
                      <div className="flex items-center">
                        <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${isDarkMode
                          ? option.status === 'active'
                            ? 'bg-green-900 text-green-300'
                            : 'bg-gray-800 text-gray-300'
                          : option.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                          }`}>
                          {option.role}
                        </span>
                      </div>
                    </div>
                  )}
                  styles={{
                    control: (base) => ({
                      ...base,
                      borderRadius: '0.75rem',
                      padding: '0.25rem',
                      boxShadow: 'none',
                      borderColor: isDarkMode ? '#4b5563' : '#e5e7eb',
                      backgroundColor: isDarkMode ? '#1f2937' : 'white',
                      '&:hover': {
                        borderColor: isDarkMode ? '#6b7280' : '#d1d5db',
                      },
                    }),
                    menu: (base) => ({
                      ...base,
                      borderRadius: '0.75rem',
                      overflow: 'hidden',
                      backgroundColor: isDarkMode ? '#1f2937' : 'white',
                      boxShadow: isDarkMode
                        ? '0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.2)'
                        : '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.04)',
                    }),
                    option: (base, state) => ({
                      ...base,
                      backgroundColor: isDarkMode
                        ? state.isSelected
                          ? '#4f46e5'
                          : state.isFocused
                            ? '#374151'
                            : '#1f2937'
                        : state.isSelected
                          ? '#4f46e5'
                          : state.isFocused
                            ? '#eef2ff'
                            : 'white',
                      color: isDarkMode
                        ? state.isSelected
                          ? 'white'
                          : '#d1d5db'
                        : state.isSelected
                          ? 'white'
                          : '#1f2937',
                      '&:hover': {
                        backgroundColor: isDarkMode
                          ? state.isSelected
                            ? '#4f46e5'
                            : '#374151'
                          : state.isSelected
                            ? '#4f46e5'
                            : '#eef2ff',
                      },
                    }),
                    multiValue: (base) => ({
                      ...base,
                      backgroundColor: isDarkMode ? '#374151' : '#eef2ff',
                      borderRadius: '0.5rem',
                    }),
                    multiValueLabel: (base) => ({
                      ...base,
                      color: isDarkMode ? '#d1d5db' : '#4f46e5',
                      fontWeight: 500,
                    }),
                    multiValueRemove: (base) => ({
                      ...base,
                      color: isDarkMode ? '#9ca3af' : '#4f46e5',
                      '&:hover': {
                        backgroundColor: isDarkMode ? '#4b5563' : '#e0e7ff',
                        color: isDarkMode ? '#f3f4f6' : '#4338ca',
                      },
                    }),
                    placeholder: (base) => ({
                      ...base,
                      color: isDarkMode ? '#6b7280' : '#9ca3af',
                    }),
                    input: (base) => ({
                      ...base,
                      color: isDarkMode ? '#d1d5db' : '#1f2937',
                    }),
                  }}
                />
              </FormControl>
            </motion.div>
          )}
        </StyledDialogContent>

        {/* Dialog Actions with enhanced styling and animations */}
        <StyledDialogActions style={{
          borderTopColor: isDarkMode ? '#374151' : '#e5e7eb',
          backgroundColor: isDarkMode ? '#1f2937' : 'white'
        }}>
          {viewMode === 'view' ? (
            isCEO && (
              <>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="contained"
                    color="warning"
                    startIcon={<FiEdit />}
                    onClick={handleEditEvent}
                    className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 mr-2 shadow-md"
                  >
                    Edit
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="contained"
                    color="error"
                    startIcon={<FiTrash2 />}
                    onClick={handleDeleteEvent}
                    className="bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 shadow-md"
                  >
                    Delete
                  </Button>
                </motion.div>
              </>
            )
          ) : (
            <>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outlined"
                  onClick={handleCloseDialog}
                  startIcon={<FiX />}
                  className="border-gray-300 text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSaveEvent}
                  startIcon={<FiCheck />}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 ml-2 shadow-md"
                >
                  {viewMode === 'edit' ? 'Update Event' : 'Create Event'}
                </Button>
              </motion.div>
            </>
          )}
        </StyledDialogActions>
      </StyledDialog>
    </div>
  );
};

export default CalendarComponent;
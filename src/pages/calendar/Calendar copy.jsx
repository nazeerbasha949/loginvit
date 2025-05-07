import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
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

const CalendarComponent = () => {
  const user = useSelector((state) => state.auth.user);
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
    end: new Date(new Date().getTime() + 60 * 60 * 1000),
    type: 'meeting',
    location: '',
    attendees: [],
  });

  // Get CEO permission from localStorage
  const isCEO = localStorage.getItem('role') === 'CEO';

  // Add this function to your CalendarComponent
const eventStyleGetter = (event) => {
  let backgroundColor = '#3788d8'; // default blue
  let borderColor = '#2c6aa8';
  let textColor = '#ffffff';
  let className = 'event-default';
  let backgroundGradient = '';

  switch (event.type) {
    case 'meeting':
      backgroundColor = '#4338ca'; // indigo
      borderColor = '#3730a3';
      className = 'event-meeting';
      backgroundGradient = 'linear-gradient(135deg, #4338ca, #6366f1)';
      break;
    case 'holiday':
      backgroundColor = '#ef4444'; // red
      borderColor = '#b91c1c';
      className = 'event-holiday';
      backgroundGradient = 'linear-gradient(135deg, #ef4444, #f87171)';
      break;
    case 'deadline':
      backgroundColor = '#f59e0b'; // amber
      borderColor = '#d97706';
      className = 'event-deadline';
      backgroundGradient = 'linear-gradient(135deg, #f59e0b, #fbbf24)';
      break;
    case 'conference':
      backgroundColor = '#8b5cf6'; // purple
      borderColor = '#7c3aed';
      className = 'event-conference';
      backgroundGradient = 'linear-gradient(135deg, #8b5cf6, #a78bfa)';
      break;
    case 'training':
      backgroundColor = '#10b981'; // emerald
      borderColor = '#059669';
      className = 'event-training';
      backgroundGradient = 'linear-gradient(135deg, #10b981, #34d399)';
      break;
  }

  return {
    style: {
      background: backgroundGradient || backgroundColor,
      borderLeft: `4px solid ${borderColor}`,
      color: textColor,
      borderRadius: '6px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      padding: '2px 5px',
      fontSize: '0.85em',
      opacity: 0.9,
      fontWeight: '500',
      transition: 'all 0.3s ease',
    },
    className: `${className} event-animation`
  };
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
          iconColor: '#4f46e5'
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
          iconColor: '#ef4444'
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
    
    fetchUsers(); // Always fetch users for displaying attendee names
  }, []);

  // Fixed: Added separate handler for the New Event button with event.stopPropagation()
  const handleNewEventClick = (event) => {
    event.stopPropagation(); // Prevent event bubbling
    openCreateEventDialog();
  };

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

  // Fixed: The handleSelectEvent to properly set the selected event
  const handleSelectEvent = (event) => {
    console.log("Event selected:", event); // For debugging
    setSelectedEvent({...event});
    setViewMode('view');
    setOpenDialog(true);
  };

  const handleEditEvent = () => {
    setViewMode('edit');
  };

  // Fixed: Added proper handling to avoid closing when clicking inside the modal
  const handleCloseDialog = (e) => {
    if (e) {
      // Only close if clicking the backdrop (not when clicking inside the modal)
      if (e.currentTarget === e.target) {
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
      }
    } else {
      // Called directly (e.g. from cancel button)
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
    }
  };

  // The rest of your code remains unchanged
  
  // Create a separate button component for the "New Event" button in the toolbar
  const NewEventButton = () => {
    if (!isCEO) return null;
    
    return (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleNewEventClick}
        className="ml-4 flex items-center px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
      >
        <FiPlus className="mr-2" size={18} />
        New Event
      </motion.button>
    );
  };

  // Fixed: Updated the toolbar component to use the separate NewEventButton component
  const customComponents = {
    event: (props) => {
      const { event } = props;
      return (
        <div 
          className="event-container overflow-hidden text-ellipsis" 
          title={`${event.title} - ${event.description || ''}`}
        >
          <div className="event-title font-semibold truncate">
            {event.title}
          </div>
          {event.location && !event.allDay && (
            <div className="event-location text-xs truncate mt-1 opacity-85">
              <span className="icon mr-1">📍</span> {event.location}
            </div>
          )}
        </div>
      );
    },
    toolbar: (toolbarProps) => {
      const { label, onNavigate, onView, view, views } = toolbarProps;
      return (
        <div className="rbc-toolbar flex flex-wrap justify-between items-center p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-xl border-b border-gray-200">
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => onNavigate('TODAY')}
              className="toolbar-btn bg-gradient-to-r from-blue-500 to-indigo-600 text-white"
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => onNavigate('PREV')}
              className="toolbar-btn bg-white"
            >
              &lt;
            </button>
            <button
              type="button"
              onClick={() => onNavigate('NEXT')}
              className="toolbar-btn bg-white"
            >
              &gt;
            </button>
          </div>
          
          <span className="rbc-toolbar-label text-xl font-medium text-gray-700 bg-white py-2 px-6 rounded-full shadow-sm border border-gray-200">
            <FiCalendar className="inline mr-2 text-indigo-500" />
            {label}
          </span>
          
          <div className="flex items-center space-x-3">
            <div className="view-btn-group flex rounded-lg overflow-hidden shadow-sm">
              {views.map(viewOption => (
                <button
                  key={viewOption}
                  type="button"
                  onClick={() => onView(viewOption)}
                  className={`view-btn ${
                    view === viewOption 
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white' 
                      : 'bg-white text-gray-700'
                  }`}
                >
                  {viewOption.charAt(0).toUpperCase() + viewOption.slice(1)}
                </button>
              ))}
            </div>
            
            <NewEventButton />
          </div>
        </div>
      );
    }
  };

  // Return statement with the main component JSX
  return (
    <div className="calendar-container mx-auto px-4 py-6 animate-fade-in">      
      <div className="page-header mb-8">
        {/* Header content */}
      </div>

      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-lg shadow-md" 
          role="alert"
        >
          {/* Error content */}
        </motion.div>
      )}

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="card bg-white shadow-2xl rounded-xl overflow-hidden border border-gray-100"
      >
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '75vh' }}
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          selectable={isCEO}
          eventPropGetter={eventStyleGetter}
          components={customComponents}
          className="calendar-wrapper"
          views={['month', 'week', 'day', 'agenda']}
          popup
          tooltipAccessor={event => `${event.title}\n${event.description || ''}\n${event.location ? `Location: ${event.location}` : ''}`}
        />
      </motion.div>

      <AnimatePresence>
        {openDialog && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm p-4" 
            onClick={handleCloseDialog}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", bounce: 0.3 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
              onClick={(e) => e.stopPropagation()} // This stops event propagation
            >
              {/* Modal content */}
              {/* Keep the rest of your modal content unchanged */}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Floating action button for mobile */}
      {isCEO && (
        <motion.button
          className="md:hidden fixed right-6 bottom-6 w-14 h-14 rounded-full bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg flex items-center justify-center z-10"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={openCreateEventDialog}
        >
          <FiPlus size={24} />
        </motion.button>
      )}
    </div>
  );
};

export default CalendarComponent;
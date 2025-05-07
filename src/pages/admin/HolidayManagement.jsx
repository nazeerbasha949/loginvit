import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  IconButton,
  MenuItem,
  Alert,
  FormControlLabel,
  Switch,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object({
  name: Yup.string().required('Holiday name is required'),
  date: Yup.date().required('Date is required'),
  type: Yup.string().required('Holiday type is required'),
  description: Yup.string(),
  isRecurring: Yup.boolean(),
});

const HolidayManagement = () => {
  const user = useSelector((state) => state.auth.user);
  const [holidays, setHolidays] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedHoliday, setSelectedHoliday] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const holidayTypes = ['Public Holiday', 'Company Holiday', 'Regional Holiday'];

  useEffect(() => {
    // TODO: Replace with actual API call
    const fetchHolidays = async () => {
      try {
        // Simulated API response
        const mockHolidays = [
          {
            id: 1,
            name: 'New Year',
            date: '2024-01-01',
            type: 'Public Holiday',
            description: 'New Year Celebration',
            isRecurring: true,
          },
          {
            id: 2,
            name: 'Company Anniversary',
            date: '2024-06-15',
            type: 'Company Holiday',
            description: 'Company Foundation Day',
            isRecurring: true,
          },
        ];
        setHolidays(mockHolidays);
      } catch (error) {
        setError('Failed to fetch holidays');
      }
    };

    fetchHolidays();
  }, []);

  const formik = useFormik({
    initialValues: {
      name: '',
      date: '',
      type: '',
      description: '',
      isRecurring: false,
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        if (selectedHoliday) {
          // Update existing holiday
          // TODO: Replace with actual API call
          const updatedHolidays = holidays.map((holiday) =>
            holiday.id === selectedHoliday.id ? { ...holiday, ...values } : holiday
          );
          setHolidays(updatedHolidays);
          setSuccess('Holiday updated successfully');
        } else {
          // Create new holiday
          // TODO: Replace with actual API call
          const newHoliday = {
            ...values,
            id: holidays.length + 1,
          };
          setHolidays([...holidays, newHoliday]);
          setSuccess('Holiday added successfully');
        }
        handleCloseDialog();
      } catch (error) {
        setError('Failed to save holiday');
      }
    },
  });

  const handleOpenDialog = (holiday = null) => {
    setSelectedHoliday(holiday);
    if (holiday) {
      formik.setValues(holiday);
    } else {
      formik.resetForm();
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedHoliday(null);
    formik.resetForm();
  };

  const handleDeleteHoliday = async (holidayId) => {
    try {
      // TODO: Replace with actual API call
      const updatedHolidays = holidays.filter((holiday) => holiday.id !== holidayId);
      setHolidays(updatedHolidays);
      setSuccess('Holiday deleted successfully');
    } catch (error) {
      setError('Failed to delete holiday');
    }
  };

  return (
    <Box>
      <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5">Holiday Management</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Add Holiday
          </Button>
        </Box>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Recurring</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {holidays.map((holiday) => (
              <TableRow key={holiday.id}>
                <TableCell>{holiday.name}</TableCell>
                <TableCell>{new Date(holiday.date).toLocaleDateString()}</TableCell>
                <TableCell>{holiday.type}</TableCell>
                <TableCell>{holiday.description}</TableCell>
                <TableCell>{holiday.isRecurring ? 'Yes' : 'No'}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleOpenDialog(holiday)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteHoliday(holiday.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedHoliday ? 'Edit Holiday' : 'Add New Holiday'}
        </DialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Holiday Name"
                  name="name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Date"
                  name="date"
                  type="date"
                  value={formik.values.date}
                  onChange={formik.handleChange}
                  error={formik.touched.date && Boolean(formik.errors.date)}
                  helperText={formik.touched.date && formik.errors.date}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  select
                  label="Holiday Type"
                  name="type"
                  value={formik.values.type}
                  onChange={formik.handleChange}
                  error={formik.touched.type && Boolean(formik.errors.type)}
                  helperText={formik.touched.type && formik.errors.type}
                >
                  {holidayTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  multiline
                  rows={3}
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  error={formik.touched.description && Boolean(formik.errors.description)}
                  helperText={formik.touched.description && formik.errors.description}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formik.values.isRecurring}
                      onChange={(e) =>
                        formik.setFieldValue('isRecurring', e.target.checked)
                      }
                    />
                  }
                  label="Recurring Holiday"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit" variant="contained">
              {selectedHoliday ? 'Update' : 'Add'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default HolidayManagement; 
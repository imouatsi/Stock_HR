import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Tooltip,
  CircularProgress,
  Alert,
  Fade,
  Zoom,
  Grid,
  Grow,
  Slide,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useTranslation } from '../hooks/useTranslation';
import GradientButton from '../components/ui/GradientButton';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
}

const Users: React.FC = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    role: '',
  });

  // Mock data - replace with actual API call
  const users: User[] = [
    { id: '1', name: 'John Doe', email: 'john@example.com', role: 'admin', status: 'active' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'manager', status: 'active' },
    { id: '3', name: 'Bob Wilson', email: 'bob@example.com', role: 'inventory_clerk', status: 'inactive' },
  ];

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // TODO: Connect to backend API to submit user data
      console.log('Submitting user:', userData);
      handleClose();
    } catch (err) {
      setError('Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'error';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          gap: 2
        }}
      >
        <CircularProgress size={60} thickness={4} />
        <Typography
          variant="h6"
          sx={{
            opacity: 0,
            animation: 'fadeInOut 1.5s infinite',
            '@keyframes fadeInOut': {
              '0%': { opacity: 0 },
              '50%': { opacity: 1 },
              '100%': { opacity: 0 },
            },
          }}
        >
          {t('common.loading')}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Slide direction="right" in={true} mountOnEnter unmountOnExit>
          <Typography variant="h4" gutterBottom>
            {t('users.title')}
          </Typography>
        </Slide>

        <Grow in={true} timeout={1000}>
          <GradientButton
            startIcon={<AddIcon />}
            onClick={handleClickOpen}
          >
            {t('users.addButton')}
          </GradientButton>
        </Grow>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
      )}

      <Fade in={true} timeout={1000}>
        <TableContainer 
          component={Paper}
          sx={{
            boxShadow: (theme) => theme.shadows[2],
            borderRadius: 2,
            overflow: 'hidden',
            '& .MuiTableCell-root': {
              borderColor: (theme) => theme.palette.divider,
            },
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 4,
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            },
          }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ 
                background: 'linear-gradient(45deg, #1976D2 30%, #2196F3 90%)',
              }}>
                <TableCell sx={{ color: 'white' }}>{t('users.name')}</TableCell>
                <TableCell sx={{ color: 'white' }}>{t('users.email')}</TableCell>
                <TableCell sx={{ color: 'white' }}>{t('users.role')}</TableCell>
                <TableCell sx={{ color: 'white' }}>{t('users.status')}</TableCell>
                <TableCell sx={{ color: 'white' }}>{t('common.actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow 
                  key={user.id}
                  sx={{
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      backgroundColor: 'action.hover',
                      transform: 'scale(1.01)',
                    },
                  }}
                >
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PersonIcon color="primary" />
                      {user.name}
                    </Box>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Chip 
                      label={t(`roles.${user.role}`)}
                      size="small"
                      sx={{ 
                        background: 'linear-gradient(45deg, #1976D2 30%, #2196F3 90%)',
                        color: 'white',
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={user.status}
                      color={getStatusColor(user.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title={t('common.edit')} arrow TransitionComponent={Zoom}>
                        <IconButton 
                          size="small"
                          sx={{
                            transition: 'all 0.2s ease-in-out',
                            '&:hover': {
                              transform: 'scale(1.1)',
                              color: 'primary.main',
                            },
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={t('common.delete')} arrow TransitionComponent={Zoom}>
                        <IconButton 
                          size="small"
                          sx={{
                            transition: 'all 0.2s ease-in-out',
                            '&:hover': {
                              transform: 'scale(1.1)',
                              color: 'error.main',
                            },
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Fade>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>{t('users.addUser')}</DialogTitle>
        <DialogContent>
          <Box sx={{ 
            pt: 2,
            '& .MuiTextField-root': {
              mb: 2,
              '& .MuiOutlinedInput-root': {
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateX(4px)',
                  '& fieldset': {
                    borderColor: 'primary.main',
                    borderWidth: '2px',
                  },
                },
              },
            },
          }}>
            <TextField
              autoFocus
              name="name"
              label={t('users.name')}
              type="text"
              fullWidth
              value={userData.name}
              onChange={handleChange}
            />
            <TextField
              name="email"
              label={t('users.email')}
              type="email"
              fullWidth
              value={userData.email}
              onChange={handleChange}
            />
            <TextField
              name="role"
              label={t('users.role')}
              type="text"
              fullWidth
              value={userData.role}
              onChange={handleChange}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={handleClose}
            sx={{
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                transform: 'scale(1.05)',
              },
            }}
          >
            {t('common.cancel')}
          </Button>
          <GradientButton onClick={handleSubmit}>
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              t('common.submit')
            )}
          </GradientButton>
        </DialogActions>
      </Dialog>

      <style>
        {`
          @keyframes fadeInOut {
            0% { opacity: 0; }
            50% { opacity: 1; }
            100% { opacity: 0; }
          }
        `}
      </style>
    </Box>
  );
};

export default Users;
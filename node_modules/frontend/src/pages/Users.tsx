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
  useTheme,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useTranslation } from '../hooks/useTranslation';
import GradientButton from '../components/ui/GradientButton';
import {
  gradientText,
  pageContainer,
  tableContainer,
  tableHeader,
  dialogTitle,
  dialogPaper,
} from '../theme/gradientStyles';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
}

const Users: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
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
    <Box sx={pageContainer}>
      <Box className="page-title">
        <Slide direction="right" in={true} mountOnEnter unmountOnExit>
          <Typography 
            variant="h4" 
            component="h1"
            sx={gradientText}
          >
            {t('users.title')}
          </Typography>
        </Slide>

        <Grow in={true} timeout={1000}>
          <GradientButton
            onClick={handleClickOpen}
            startIcon={<AddIcon />}
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
          sx={tableContainer(theme)}
        >
          <Table>
            <TableHead>
              <TableRow sx={tableHeader}>
                <TableCell>{t('users.name')}</TableCell>
                <TableCell>{t('users.email')}</TableCell>
                <TableCell>{t('users.role')}</TableCell>
                <TableCell>{t('users.status')}</TableCell>
                <TableCell>{t('common.actions')}</TableCell>
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
                      '& .row-actions': {
                        transform: 'translateX(0)',
                        opacity: 1,
                      },
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
                      label={t(`users.roles.${user.role}`)}
                      sx={{
                        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                        color: 'white',
                        fontWeight: 'medium',
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={t(`users.status.${user.status}`)}
                      color={getStatusColor(user.status)}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Box 
                      className="row-actions"
                      sx={{
                        display: 'flex',
                        gap: 1,
                        transform: 'translateX(20px)',
                        opacity: 0,
                        transition: 'all 0.3s ease-in-out',
                      }}
                    >
                      <Tooltip title={t('common.edit')} arrow TransitionComponent={Zoom}>
                        <IconButton
                          size="small"
                          sx={{
                            transition: 'all 0.2s ease-in-out',
                            '&:hover': {
                              transform: 'scale(1.1) rotate(-8deg)',
                              color: 'info.main',
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
                              transform: 'scale(1.1) rotate(8deg)',
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

      <Dialog 
        open={open} 
        onClose={handleClose}
        TransitionComponent={Zoom}
        PaperProps={{
          sx: dialogPaper
        }}
      >
        <DialogTitle sx={dialogTitle}>
          {t('users.addUser')}
        </DialogTitle>
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
              value={userData.name}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              name="email"
              label={t('users.email')}
              type="email"
              value={userData.email}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              name="role"
              label={t('users.role')}
              value={userData.role}
              onChange={handleChange}
              fullWidth
              required
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
            {t('common.submit')}
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
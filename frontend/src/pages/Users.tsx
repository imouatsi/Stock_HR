import React, { useState } from 'react';
import { Box, Typography, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useTranslation } from '../hooks/useTranslation';
import AddIcon from '@mui/icons-material/Add';

const Users: React.FC = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    role: '',
  });

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
    // TODO: Connect to backend API to submit user data
    console.log('Submitting user:', userData);
    handleClose();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1">
        {t('users.title')}
      </Typography>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={handleClickOpen}
      >
        {t('users.addButton')}
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{t('users.addUser')}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label={t('users.name')}
            type="text"
            fullWidth
            variant="standard"
            value={userData.name}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="email"
            label={t('users.email')}
            type="email"
            fullWidth
            variant="standard"
            value={userData.email}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="role"
            label={t('users.role')}
            type="text"
            fullWidth
            variant="standard"
            value={userData.role}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            {t('common.cancel')}
          </Button>
          <Button onClick={handleSubmit} color="primary">
            {t('common.submit')}
          </Button>
        </DialogActions>
      </Dialog>
      <Typography variant="body1" sx={{ mt: 2 }}>
        {t('common.noData')}
      </Typography>
    </Box>
  );
};

export default Users;
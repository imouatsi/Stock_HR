import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Link,
} from '@mui/material';
import { api } from '../../../services/api';

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'password') {
      setPassword(value);
    } else {
      setConfirmPassword(value);
    }

    if (name === 'confirmPassword' && value !== password) {
      setPasswordError('Passwords do not match');
    } else if (name === 'password' && value !== confirmPassword) {
      setPasswordError('Passwords do not match');
    } else {
      setPasswordError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await api.post(`/auth/reset-password/${token}`, { password });
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        p: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          maxWidth: 400,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Reset Password
        </Typography>

        {error && (
          <Alert severity="error" onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success">
            Password has been reset successfully. Redirecting to login page...
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="New Password"
            type="password"
            name="password"
            value={password}
            onChange={handlePasswordChange}
            margin="normal"
            required
            error={!!passwordError}
            helperText={passwordError}
          />

          <TextField
            fullWidth
            label="Confirm New Password"
            type="password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={handlePasswordChange}
            margin="normal"
            required
            error={!!passwordError}
            helperText={passwordError}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={loading || !!passwordError}
            sx={{ mt: 3, mb: 2 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Reset Password'}
          </Button>

          <Box sx={{ textAlign: 'center' }}>
            <Link href="/login" variant="body2">
              Back to Login
            </Link>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default ResetPassword; 
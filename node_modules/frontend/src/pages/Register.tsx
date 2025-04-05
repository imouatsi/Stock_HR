import { useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { AppDispatch, RootState } from '../features/store';
import { register, clearError } from '../features/auth/authSlice';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  MenuItem,
  Fade,
  Grow,
  styled,
} from '@mui/material';
import { gradientText, gradientBox } from '../theme/gradientStyles';
import GradientButton from '../components/ui/GradientButton';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '100%',
  position: 'relative',
  overflow: 'hidden',
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  borderRadius: 16,
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
  },
  ...gradientBox,
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      transform: 'translateX(4px)',
      '& fieldset': {
        borderColor: theme.palette.primary.main,
        borderWidth: '2px',
      },
    },
    '&.Mui-focused': {
      backgroundColor: 'rgba(255, 255, 255, 1)',
      boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.2)',
    },
  },
}));

const validationSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  role: Yup.string().required('Role is required'),
});

const roles = [
  { value: 'admin', label: 'Admin' },
  { value: 'manager', label: 'Manager' },
  { value: 'seller', label: 'Seller' },
  { value: 'stock_clerk', label: 'Stock Clerk' },
];

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      role: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await dispatch(register(values)).unwrap();
        toast.success('Registration successful!');
        navigate('/dashboard');
      } catch (err) {
        if (err instanceof Error) {
          toast.error(err.message);
        } else if (typeof err === 'string') {
          toast.error(err);
        } else {
          toast.error('Registration failed');
        }
      }
    },
  });

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(135deg, #1976d2 0%, #64b5f6 100%)',
        padding: 3,
      }}
    >
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Fade in={true} timeout={1000}>
            <StyledPaper elevation={3}>
              <Typography 
                component="h1" 
                variant="h4"
                sx={gradientText}
                gutterBottom
              >
                Sign up
              </Typography>
              <Box
                component="form"
                onSubmit={formik.handleSubmit}
                sx={{ mt: 3, width: '100%' }}
              >
                <StyledTextField
                  margin="normal"
                  fullWidth
                  id="email"
                  name="email"
                  label="Email Address"
                  autoComplete="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                />
                <StyledTextField
                  margin="normal"
                  fullWidth
                  id="password"
                  name="password"
                  label="Password"
                  type="password"
                  autoComplete="new-password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  error={formik.touched.password && Boolean(formik.errors.password)}
                  helperText={formik.touched.password && formik.errors.password}
                />
                <StyledTextField
                  margin="normal"
                  fullWidth
                  id="firstName"
                  name="firstName"
                  label="First Name"
                  value={formik.values.firstName}
                  onChange={formik.handleChange}
                  error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                  helperText={formik.touched.firstName && formik.errors.firstName}
                />
                <StyledTextField
                  margin="normal"
                  fullWidth
                  id="lastName"
                  name="lastName"
                  label="Last Name"
                  value={formik.values.lastName}
                  onChange={formik.handleChange}
                  error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                  helperText={formik.touched.lastName && formik.errors.lastName}
                />
                <StyledTextField
                  margin="normal"
                  fullWidth
                  id="role"
                  name="role"
                  label="Role"
                  select
                  value={formik.values.role}
                  onChange={formik.handleChange}
                  error={formik.touched.role && Boolean(formik.errors.role)}
                  helperText={formik.touched.role && formik.errors.role}
                >
                  {roles.map((option) => (
                    <MenuItem 
                      key={option.value} 
                      value={option.value}
                      sx={{
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          transform: 'translateX(4px)',
                          background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                          color: 'white',
                        },
                      }}
                    >
                      {option.label}
                    </MenuItem>
                  ))}
                </StyledTextField>
                <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <GradientButton
                    type="submit"
                    fullWidth
                    disabled={loading}
                  >
                    {loading ? 'Signing up...' : 'Sign Up'}
                  </GradientButton>
                  <Button
                    fullWidth
                    variant="text"
                    onClick={() => navigate('/login')}
                    sx={{
                      color: 'white',
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                      },
                    }}
                  >
                    Already have an account? Sign in
                  </Button>
                </Box>
              </Box>
            </StyledPaper>
          </Fade>
        </Box>
      </Container>
    </Box>
  );
};

export default Register;
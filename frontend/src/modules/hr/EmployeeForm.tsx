import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box
} from '@mui/material';
import { Employee } from '@/types/employee';

const employeeSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  department: z.string().min(1, 'Department is required'),
  position: z.string().min(1, 'Position is required'),
  hireDate: z.string().min(1, 'Hire date is required'),
});

type EmployeeFormData = z.infer<typeof employeeSchema>;

interface EmployeeFormProps {
  initialData?: Employee;
  onSubmit: (data: EmployeeFormData) => void;
}

export const EmployeeForm: React.FC<EmployeeFormProps> = ({ initialData, onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    defaultValues: initialData,
  });

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="First Name"
            {...register('firstName')}
            error={!!errors.firstName}
            helperText={errors.firstName?.message}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Last Name"
            {...register('lastName')}
            error={!!errors.lastName}
            helperText={errors.lastName?.message}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            {...register('email')}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Phone"
            {...register('phone')}
            error={!!errors.phone}
            helperText={errors.phone?.message}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth error={!!errors.department}>
            <InputLabel>Department</InputLabel>
            <Select
              label="Department"
              {...register('department')}
              defaultValue={initialData?.department}
            >
              {/* TODO: Add department options */}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth error={!!errors.position}>
            <InputLabel>Position</InputLabel>
            <Select
              label="Position"
              {...register('position')}
              defaultValue={initialData?.position}
            >
              {/* TODO: Add position options */}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Hire Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            {...register('hireDate')}
            error={!!errors.hireDate}
            helperText={errors.hireDate?.message}
          />
        </Grid>
        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary">
            Save Employee
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}; 
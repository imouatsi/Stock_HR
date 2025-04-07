import React from 'react';
import { useParams } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
  Box,
  Grid,
  CircularProgress,
  Paper
} from '@mui/material';
import { Employee } from '@/types/employee';

export const EmployeeDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [employee, setEmployee] = React.useState<Employee | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // TODO: Fetch employee details from API
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (!employee) {
    return (
      <Box p={3}>
        <Typography variant="h6" color="error">
          Employee not found
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Card>
        <CardHeader
          title={
            <Typography variant="h5" component="h1">
              Employee Details
            </Typography>
          }
        />
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Personal Information
                </Typography>
                <Typography>Name: {employee.firstName} {employee.lastName}</Typography>
                <Typography>Email: {employee.email}</Typography>
                <Typography>Phone: {employee.phone}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Work Information
                </Typography>
                <Typography>Department: {employee.department}</Typography>
                <Typography>Position: {employee.position}</Typography>
                <Typography>Hire Date: {employee.hireDate}</Typography>
              </Paper>
            </Grid>
          </Grid>
          <Box mt={3}>
            <Button variant="contained" color="primary">
              Edit Employee
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}; 
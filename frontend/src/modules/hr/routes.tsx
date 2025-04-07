import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { EmployeeService } from './EmployeeService';
import { DepartmentService } from './DepartmentService';
import { PositionService } from './PositionService';
import { EmployeeDetails } from './EmployeeDetails';
import { HRDashboard } from './pages/Dashboard';

export const HRRoutes: React.FC = () => {
  return (
    <Routes>
      <Route index element={<HRDashboard />} />
      <Route path="employees" element={<EmployeeService />} />
      <Route path="employees/:id" element={<EmployeeDetails />} />
      <Route path="departments" element={<DepartmentService />} />
      <Route path="positions" element={<PositionService />} />
    </Routes>
  );
}; 
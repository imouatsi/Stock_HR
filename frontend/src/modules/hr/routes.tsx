import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '../../components/ProtectedRoute';
import { EmployeeList } from './components/EmployeeList';
import { DepartmentList } from './components/DepartmentList';
import { PositionList } from './components/PositionList';
import { EmployeeForm } from './components/EmployeeForm';
import { DepartmentForm } from './components/DepartmentForm';
import { PositionForm } from './components/PositionForm';
import { EmployeeDetails } from './components/EmployeeDetails';
import { DepartmentDetails } from './components/DepartmentDetails';
import { PositionDetails } from './components/PositionDetails';
import { employeeService } from './services/EmployeeService';
import { departmentService } from './services/DepartmentService';
import { positionService } from './services/PositionService';

export const HRRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Employee Routes */}
      <Route
        path="/employees"
        element={
          <ProtectedRoute>
            <EmployeeList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/employees/new"
        element={
          <ProtectedRoute>
            <EmployeeForm
              onSubmit={employeeService.createEmployee}
            />
          </ProtectedRoute>
        }
      />
      <Route
        path="/employees/:id"
        element={
          <ProtectedRoute>
            <EmployeeDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/employees/:id/edit"
        element={
          <ProtectedRoute>
            <EmployeeForm
              onSubmit={employeeService.updateEmployee}
            />
          </ProtectedRoute>
        }
      />

      {/* Department Routes */}
      <Route
        path="/departments"
        element={
          <ProtectedRoute>
            <DepartmentList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/departments/new"
        element={
          <ProtectedRoute>
            <DepartmentForm
              onSubmit={departmentService.createDepartment}
            />
          </ProtectedRoute>
        }
      />
      <Route
        path="/departments/:id"
        element={
          <ProtectedRoute>
            <DepartmentDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/departments/:id/edit"
        element={
          <ProtectedRoute>
            <DepartmentForm
              onSubmit={departmentService.updateDepartment}
            />
          </ProtectedRoute>
        }
      />

      {/* Position Routes */}
      <Route
        path="/positions"
        element={
          <ProtectedRoute>
            <PositionList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/positions/new"
        element={
          <ProtectedRoute>
            <PositionForm
              onSubmit={positionService.createPosition}
            />
          </ProtectedRoute>
        }
      />
      <Route
        path="/positions/:id"
        element={
          <ProtectedRoute>
            <PositionDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/positions/:id/edit"
        element={
          <ProtectedRoute>
            <PositionForm
              onSubmit={positionService.updatePosition}
            />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}; 
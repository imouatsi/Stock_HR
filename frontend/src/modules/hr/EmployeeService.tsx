import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EmployeeList } from './EmployeeList';
import { EmployeeForm } from './EmployeeForm';

export const EmployeeService: React.FC = () => {
  return (
    <div className="container mx-auto py-6">
      <Tabs defaultValue="list" className="w-full">
        <TabsList>
          <TabsTrigger value="list">Employee List</TabsTrigger>
          <TabsTrigger value="add">Add Employee</TabsTrigger>
        </TabsList>
        <TabsContent value="list">
          <EmployeeList />
        </TabsContent>
        <TabsContent value="add">
          <EmployeeForm onSubmit={(data) => {
            // TODO: Handle form submission
            console.log(data);
          }} />
        </TabsContent>
      </Tabs>
    </div>
  );
}; 
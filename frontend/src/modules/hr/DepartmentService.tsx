import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DepartmentList } from './DepartmentList';
import { DepartmentForm } from './DepartmentForm';

export const DepartmentService: React.FC = () => {
  return (
    <div className="container mx-auto py-6">
      <Tabs defaultValue="list" className="w-full">
        <TabsList>
          <TabsTrigger value="list">Department List</TabsTrigger>
          <TabsTrigger value="add">Add Department</TabsTrigger>
        </TabsList>
        <TabsContent value="list">
          <DepartmentList />
        </TabsContent>
        <TabsContent value="add">
          <DepartmentForm onSubmit={(data) => {
            // TODO: Handle form submission
            console.log(data);
          }} />
        </TabsContent>
      </Tabs>
    </div>
  );
}; 
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PositionList } from './PositionList';
import { PositionForm } from './PositionForm';

export const PositionService: React.FC = () => {
  return (
    <div className="container mx-auto py-6">
      <Tabs defaultValue="list" className="w-full">
        <TabsList>
          <TabsTrigger value="list">Position List</TabsTrigger>
          <TabsTrigger value="add">Add Position</TabsTrigger>
        </TabsList>
        <TabsContent value="list">
          <PositionList />
        </TabsContent>
        <TabsContent value="add">
          <PositionForm onSubmit={(data) => {
            // TODO: Handle form submission
            console.log(data);
          }} />
        </TabsContent>
      </Tabs>
    </div>
  );
}; 
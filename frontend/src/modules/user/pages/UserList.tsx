import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export function UserList() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Users</h1>
        <Link to="/users/new">
          <Button>Add User</Button>
        </Link>
      </div>
      {/* Table implementation will go here */}
    </div>
  );
}

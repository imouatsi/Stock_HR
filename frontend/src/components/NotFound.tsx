import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="mt-2 text-lg">Page not found</p>
      <Button asChild className="mt-4">
        <Link to="/">Go back home</Link>
      </Button>
    </div>
  );
}

export default NotFound;

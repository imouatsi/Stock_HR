import React from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function UserForm() {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data: any) => {
    console.log(data);
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="text-2xl font-bold">New User</h2>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input {...register('name')} placeholder="Name" />
          <Input {...register('email')} type="email" placeholder="Email" />
          <Input {...register('role')} placeholder="Role" />
          <Button type="submit">Save User</Button>
        </form>
      </CardContent>
    </Card>
  );
}

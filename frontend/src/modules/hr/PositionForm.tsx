import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Position } from '@/types/position';

const positionSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  department: z.string().min(1, 'Department is required'),
  level: z.string().min(1, 'Level is required'),
  description: z.string().min(1, 'Description is required'),
});

type PositionFormData = z.infer<typeof positionSchema>;

interface PositionFormProps {
  initialData?: Position;
  onSubmit: (data: PositionFormData) => void;
}

export const PositionForm: React.FC<PositionFormProps> = ({ initialData, onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<PositionFormData>({
    resolver: zodResolver(positionSchema),
    defaultValues: initialData,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          {...register('title')}
          error={errors.title?.message}
        />
      </div>

      <div>
        <Label htmlFor="department">Department</Label>
        <Select
          onValueChange={(value) => setValue('department', value)}
          defaultValue={initialData?.department}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select department" />
          </SelectTrigger>
          <SelectContent>
            {/* TODO: Add department options */}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="level">Level</Label>
        <Select
          onValueChange={(value) => setValue('level', value)}
          defaultValue={initialData?.level}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="entry">Entry Level</SelectItem>
            <SelectItem value="mid">Mid Level</SelectItem>
            <SelectItem value="senior">Senior Level</SelectItem>
            <SelectItem value="lead">Lead</SelectItem>
            <SelectItem value="manager">Manager</SelectItem>
            <SelectItem value="director">Director</SelectItem>
            <SelectItem value="executive">Executive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          {...register('description')}
          error={errors.description?.message}
        />
      </div>

      <Button type="submit">Save Position</Button>
    </form>
  );
}; 
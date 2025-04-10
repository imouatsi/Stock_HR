import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/components/ui/use-toast';
import { hrService } from '@/services/hrService';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { columns } from './performance-reviews/columns';

interface PerformanceReview {
  id: string;
  employee: string;
  reviewer: string;
  reviewDate: string;
  rating: number;
  status: string;
}

export default function PerformanceReviews() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [reviews, setReviews] = useState<PerformanceReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setIsLoading(true);
      const data = await hrService.getAllPerformanceReviews();
      setReviews(data.map(review => ({
        id: review._id || review.id,
        employee: review.employeeName || review.employee,
        reviewer: review.reviewerName || review.reviewer,
        reviewDate: review.date,
        rating: review.score,
        status: review.status || 'completed'
      })));
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load performance reviews.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewReview = () => {
    toast({
      title: 'Not Implemented',
      description: 'This feature is coming soon.',
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Performance Reviews</h1>
        <Button onClick={handleNewReview}>
          New Performance Review
        </Button>
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <DataTable columns={columns} data={reviews} searchKey="employee" />
      )}
    </div>
  );
}
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { hrService } from '@/services/hrService';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { columns } from './performance-reviews/columns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface PerformanceReview {
  id: string;
  employee: string;
  reviewer: string;
  reviewDate: string;
  rating: number;
  status: string;
}

export default function PerformanceReviews() {

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

  const [isNewReviewModalOpen, setIsNewReviewModalOpen] = useState(false);
  const [newReview, setNewReview] = useState({
    employeeId: '',
    employeeName: '',
    reviewerId: '',
    reviewerName: '',
    period: '',
    rating: 0,
    comments: ''
  });

  const handleNewReview = () => {
    setIsNewReviewModalOpen(true);
  };

  const handleSubmitReview = async () => {
    try {
      setIsLoading(true);
      await hrService.createPerformanceReview(newReview);
      toast({
        title: 'Success',
        description: 'Performance review submitted successfully',
        variant: 'default',
      });
      setIsNewReviewModalOpen(false);
      setNewReview({
        employeeId: '',
        employeeName: '',
        reviewerId: '',
        reviewerName: '',
        period: '',
        rating: 0,
        comments: ''
      });
      fetchReviews();
    } catch (error) {
      console.error('Error submitting performance review:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit performance review',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
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

      {/* New Performance Review Modal */}
      <Dialog open={isNewReviewModalOpen} onOpenChange={setIsNewReviewModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Submit New Performance Review</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="text-right">Employee ID:</div>
              <Input
                value={newReview.employeeId}
                onChange={(e) => setNewReview({...newReview, employeeId: e.target.value})}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <div className="text-right">Employee Name:</div>
              <Input
                value={newReview.employeeName}
                onChange={(e) => setNewReview({...newReview, employeeName: e.target.value})}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <div className="text-right">Reviewer ID:</div>
              <Input
                value={newReview.reviewerId}
                onChange={(e) => setNewReview({...newReview, reviewerId: e.target.value})}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <div className="text-right">Reviewer Name:</div>
              <Input
                value={newReview.reviewerName}
                onChange={(e) => setNewReview({...newReview, reviewerName: e.target.value})}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <div className="text-right">Period:</div>
              <Input
                value={newReview.period}
                onChange={(e) => setNewReview({...newReview, period: e.target.value})}
                className="col-span-3"
                placeholder="e.g., Q1 2023"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <div className="text-right">Rating (1-5):</div>
              <Input
                type="number"
                min="1"
                max="5"
                value={newReview.rating}
                onChange={(e) => setNewReview({...newReview, rating: parseInt(e.target.value) || 0})}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <div className="text-right">Comments:</div>
              <Textarea
                value={newReview.comments}
                onChange={(e) => setNewReview({...newReview, comments: e.target.value})}
                className="col-span-3"
                rows={5}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsNewReviewModalOpen(false)}>Cancel</Button>
            <Button type="button" onClick={handleSubmitReview}>Submit Review</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
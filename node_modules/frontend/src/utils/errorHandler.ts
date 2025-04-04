import { toast } from 'react-toastify';

export class AppError extends Error {
  constructor(
    public message: string,
    public code: string,
    public status: number = 500
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const handleError = (error: unknown) => {
  if (error instanceof AppError) {
    toast.error(`Error (${error.code}): ${error.message}`);
    return;
  }

  if (error instanceof Error) {
    toast.error(error.message);
    return;
  }

  toast.error('An unexpected error occurred');
  console.error('Unhandled error:', error);
};

export const createErrorBoundary = (promise: Promise<any>) => {
  return promise.catch((error) => {
    handleError(error);
    throw error;
  });
};

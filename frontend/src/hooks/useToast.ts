import { useToast as useToastUI } from '../components/ui/use-toast';
import { ToastActionElement } from '@/components/ui/toast';

interface ToastProps {
  title?: string;
  description: string;
  action?: ToastActionElement;
  variant?: 'default' | 'destructive';
}

export const useToast = () => {
  const { toast } = useToastUI();

  const showToast = ({
    title,
    description,
    action,
    variant = 'default'
  }: ToastProps) => {
    toast({
      title,
      description,
      action,
      variant,
    });
  };

  return {
    toast: showToast,
    showToast
  };
};

export default useToast; 
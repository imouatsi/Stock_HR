import { useDispatch } from 'react-redux';
import { AppDispatch } from '../features/store';
import { addNotification, removeNotification } from '../features/notifications/notificationSlice';

export const useNotification = () => {
  const dispatch = useDispatch<AppDispatch>();

  const showNotification = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    const id = Date.now().toString();
    dispatch(addNotification({ id, message, type }));
    setTimeout(() => {
      dispatch(removeNotification(id));
    }, 5000);
  };

  return {
    showNotification,
  };
}; 
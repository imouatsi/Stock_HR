import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../features/store';

interface SubscriptionQuota {
  storage: {
    used: number;
    total: number;
    percentage: number;
  };
  apiCalls: {
    used: number;
    total: number;
    percentage: number;
  };
  daysRemaining: number;
}

export const useSubscription = () => {
  const [quota, setQuota] = useState<SubscriptionQuota | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const fetchQuota = async () => {
      try {
        const response = await fetch(`/api/users/${user?.id}/subscription/quota`);
        const data = await response.json();
        setQuota(data);
      } catch (error) {
        console.error('Failed to fetch subscription quota:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchQuota();
    }
  }, [user]);

  const checkFeatureAccess = (featureName: string): boolean => {
    return user?.subscription?.features.includes(featureName) ?? false;
  };

  return { quota, loading, checkFeatureAccess };
};

import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../features/store';

interface AuditEvent {
  action: string;
  category: string;
  details: Record<string, any>;
  metadata?: {
    ipAddress?: string;
    userAgent?: string;
    location?: string;
  };
}

export const useAuditTrail = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  const logEvent = useCallback(async (event: AuditEvent) => {
    try {
      const response = await fetch('/api/audit-log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...event,
          userId: user?.id,
          timestamp: new Date().toISOString(),
          metadata: {
            ...event.metadata,
            userAgent: navigator.userAgent,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to log audit event');
      }
    } catch (error) {
      console.error('Audit logging failed:', error);
      // Store failed events in localStorage for retry
      const failedEvents = JSON.parse(localStorage.getItem('failedAuditEvents') || '[]');
      failedEvents.push({ ...event, timestamp: new Date().toISOString() });
      localStorage.setItem('failedAuditEvents', JSON.stringify(failedEvents));
    }
  }, [user]);

  const retryFailedEvents = useCallback(async () => {
    const failedEvents = JSON.parse(localStorage.getItem('failedAuditEvents') || '[]');
    if (failedEvents.length === 0) return;

    const successfulRetries = [];
    for (const event of failedEvents) {
      try {
        await logEvent(event);
        successfulRetries.push(event);
      } catch (error) {
        console.error('Retry failed for event:', event);
      }
    }

    // Remove successful retries from failed events
    const remainingEvents = failedEvents.filter(
      (event: AuditEvent) => !successfulRetries.includes(event)
    );
    localStorage.setItem('failedAuditEvents', JSON.stringify(remainingEvents));
  }, [logEvent]);

  return {
    logEvent,
    retryFailedEvents,
  };
};

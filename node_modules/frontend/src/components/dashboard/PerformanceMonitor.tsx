import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { Line } from 'react-chartjs-2';

export const PerformanceMonitor: React.FC = () => {
  const [metrics, setMetrics] = React.useState<any[]>([]);

  const socketRef = React.useRef<WebSocket>();

  React.useEffect(() => {
    socketRef.current = new WebSocket('ws://localhost:5000/metrics');
    
    socketRef.current.onmessage = (event) => {
      const newMetric = JSON.parse(event.data);
      setMetrics(prev => [...prev, newMetric].slice(-20));
    };

    return () => socketRef.current?.close();
  }, []);

  return (
    <div>
      {/* ...existing JSX... */}
    </div>
  );
};

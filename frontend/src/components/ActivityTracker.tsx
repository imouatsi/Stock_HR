import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Badge } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../features/store';
import { motion } from 'framer-motion'; // Fix incorrect import
import { useAnimation } from 'framer-motion'; // Fix incorrect import

export const ActivityTracker: React.FC = () => {
  const [lastActivity, setLastActivity] = useState<Date>(new Date());
  const [isIdle, setIsIdle] = useState(false);
  const controls = useAnimation();
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    let idleTimer: NodeJS.Timeout;
    const resetTimer = () => {
      setLastActivity(new Date());
      setIsIdle(false);
      if (idleTimer) clearTimeout(idleTimer);
      idleTimer = setTimeout(() => setIsIdle(true), 300000); // 5 minutes
    };

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => document.addEventListener(event, resetTimer));

    return () => {
      events.forEach(event => document.removeEventListener(event, resetTimer));
      if (idleTimer) clearTimeout(idleTimer);
    };
  }, []);

  useEffect(() => {
    controls.start({
      scale: isIdle ? 0.95 : 1,
      opacity: isIdle ? 0.7 : 1,
      transition: { duration: 0.3 }
    });
  }, [isIdle, controls]);

  return (
    <motion.div animate={controls}>
      <Box sx={{ position: 'fixed', top: 20, right: 20, zIndex: 1000 }}>
        <Badge
          overlap="circular"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          variant="dot"
          color={isIdle ? 'warning' : 'success'}
        >
          <CircularProgress
            variant="determinate"
            value={100}
            size={40}
            thickness={4}
            sx={{
              color: theme => isIdle ? theme.palette.warning.main : theme.palette.success.main
            }}
          />
        </Badge>
        <Typography variant="caption" display="block" textAlign="center">
          {isIdle ? 'Idle' : 'Active'}
        </Typography>
      </Box>
    </motion.div>
  );
};

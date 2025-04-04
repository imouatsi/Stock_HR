import React from 'react';
import { Box, Avatar, Tooltip, Badge, AvatarGroup } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

interface User {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'away' | 'offline';
  lastSeen?: Date;
}

interface LivePresenceProps {
  users: User[];
  maxDisplayed?: number;
}

export const LivePresence: React.FC<LivePresenceProps> = ({ 
  users, 
  maxDisplayed = 5 
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'success.main';
      case 'away': return 'warning.main';
      default: return 'grey.500';
    }
  };

  return (
    <AvatarGroup max={maxDisplayed}>
      <AnimatePresence>
        {users.map((user) => (
          <motion.div
            key={user.id}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <Tooltip 
              title={`${user.name} - ${user.status}${user.lastSeen ? ` - Last seen ${new Date(user.lastSeen).toLocaleTimeString()}` : ''}`}
              arrow
            >
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                variant="dot"
                sx={{
                  '& .MuiBadge-badge': {
                    backgroundColor: getStatusColor(user.status),
                    boxShadow: `0 0 0 2px ${getStatusColor(user.status)}22`
                  }
                }}
              >
                <Avatar 
                  src={user.avatar}
                  sx={{
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'scale(1.1)'
                    }
                  }}
                />
              </Badge>
            </Tooltip>
          </motion.div>
        ))}
      </AnimatePresence>
    </AvatarGroup>
  );
};

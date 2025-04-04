import React from 'react';
import { Box, List, ListItem, ListItemText, ListItemAvatar, Avatar, Chip, IconButton } from '@mui/material';
import { Message, VideoCall, Share } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { RootState } from '../../features/store';
import { motion, AnimatePresence } from 'framer-motion';

export const TeamSpace: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const teams = user?.settings?.workspace?.collaboration?.teams || [];

  return (
    <AnimatePresence>
      <List>
        {teams.map((team: { id: string; role: string }, index: number) => (
          <motion.div
            key={team.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <ListItem
              secondaryAction={
                <Box>
                  <IconButton size="small"><Message /></IconButton>
                  <IconButton size="small"><VideoCall /></IconButton>
                  <IconButton size="small"><Share /></IconButton>
                </Box>
              }
            >
              <ListItemAvatar>
                <Avatar>{team.id[0].toUpperCase()}</Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={team.id}
                secondary={
                  <Chip
                    size="small"
                    label={team.role}
                    color={team.role === 'leader' ? 'primary' : 'default'}
                  />
                }
              />
            </ListItem>
          </motion.div>
        ))}
      </List>
    </AnimatePresence>
  );
};

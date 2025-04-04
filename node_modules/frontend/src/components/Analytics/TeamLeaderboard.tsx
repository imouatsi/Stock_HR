import React from 'react';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  EmojiEvents as TrophyIcon,
  TrendingUp,
  AddCircleOutline
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

interface TeamMember {
  id: string;
  name: string;
  score: number;
  level: number;
  trend: 'up' | 'down' | 'stable';
  achievements: string[];
  avatar?: string;
}

export const TeamLeaderboard: React.FC = () => {
  const [members, setMembers] = React.useState<TeamMember[]>([]);
  const [timeframe, setTimeframe] = React.useState<'daily' | 'weekly' | 'monthly'>('weekly');

  const listVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { x: -20, opacity: 0 },
    show: { x: 0, opacity: 1 }
  };

  return (
    <Paper sx={{ p: 3, overflow: 'hidden' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">
          Team Leaderboard
          <TrophyIcon color="primary" sx={{ ml: 1 }} />
        </Typography>
        {/* Add timeframe selector */}
      </Box>

      <AnimatePresence>
        <motion.div
          variants={listVariants}
          initial="hidden"
          animate="show"
        >
          <List>
            {members.map((member, index) => (
              <motion.div key={member.id} variants={itemVariants}>
                <ListItem
                  sx={{
                    bgcolor: index < 3 ? 'action.selected' : 'transparent',
                    borderRadius: 1,
                    mb: 1
                  }}
                >
                  <ListItemAvatar>
                    <Avatar src={member.avatar}>
                      {member.name[0]}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center">
                        {member.name}
                        {index < 3 && (
                          <Chip
                            size="small"
                            label={`#${index + 1}`}
                            color={['primary', 'secondary', 'default'][index]}
                            sx={{ ml: 1 }}
                          />
                        )}
                      </Box>
                    }
                    secondary={`Level ${member.level}`}
                  />
                  <Box>
                    <Typography variant="h6" color="primary">
                      {member.score}
                    </Typography>
                    {member.trend === 'up' && (
                      <TrendingUp color="success" />
                    )}
                  </Box>
                </ListItem>
              </motion.div>
            ))}
          </List>
        </motion.div>
      </AnimatePresence>
    </Paper>
  );
};

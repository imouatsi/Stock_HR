import React from 'react';
import { Box, Paper, Typography, Card, Grid } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

interface KanbanItem {
  id: string;
  content: string;
  priority: 'low' | 'medium' | 'high';
}

interface KanbanColumn {
  id: string;
  title: string;
  items: KanbanItem[];
}

interface KanbanBoardProps {
  columns: KanbanColumn[];
  onDragEnd: (result: any) => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ columns, onDragEnd }) => {
  const getPriorityColor = (priority: string) => {
    const colors = {
      low: '#4caf50',
      medium: '#ff9800',
      high: '#f44336'
    };
    return colors[priority as keyof typeof colors];
  };

  return (
    <Box sx={{ p: 2, minHeight: 400 }}>
      <Grid container spacing={2}>
        {columns.map(column => (
          <Grid item xs={12} md={4} key={column.id}>
            <Paper
              sx={{
                p: 2,
                backgroundColor: 'background.paper',
                minHeight: 200
              }}
            >
              <Typography variant="h6" gutterBottom>
                {column.title} ({column.items.length})
              </Typography>
              <AnimatePresence>
                {column.items.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card
                      sx={{
                        p: 2,
                        mb: 1,
                        backgroundColor: 'background.paper',
                        borderLeft: `4px solid ${getPriorityColor(item.priority)}`,
                        '&:hover': {
                          boxShadow: 3
                        }
                      }}
                    >
                      <Typography>{item.content}</Typography>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

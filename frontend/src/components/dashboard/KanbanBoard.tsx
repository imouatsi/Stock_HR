import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
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
    <DragDropContext onDragEnd={onDragEnd}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: `repeat(${columns.length}, 1fr)`,
          gap: 2,
          p: 2,
          minHeight: 400
        }}
      >
        {columns.map(column => (
          <Droppable key={column.id} droppableId={column.id}>
            {(provided, snapshot) => (
              <Paper
                ref={provided.innerRef}
                {...provided.droppableProps}
                sx={{
                  p: 2,
                  backgroundColor: snapshot.isDraggingOver ? 'action.hover' : 'background.paper',
                  transition: 'background-color 0.2s ease',
                  minHeight: 200
                }}
              >
                <Typography variant="h6" gutterBottom>
                  {column.title} ({column.items.length})
                </Typography>
                <AnimatePresence>
                  {column.items.map((item, index) => (
                    <Draggable key={item.id} draggableId={item.id} index={index}>
                      {(provided, snapshot) => (
                        <motion.div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.5 }}
                          style={provided.draggableProps.style}
                        >
                          <Paper
                            sx={{
                              p: 2,
                              mb: 1,
                              backgroundColor: snapshot.isDragging ? 'action.selected' : 'background.paper',
                              borderLeft: `4px solid ${getPriorityColor(item.priority)}`,
                              transform: snapshot.isDragging ? 'rotate(3deg)' : 'none',
                              transition: 'all 0.2s ease',
                              '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: 3
                              }
                            }}
                          >
                            {item.content}
                          </Paper>
                        </motion.div>
                      )}
                    </Draggable>
                  ))}
                </AnimatePresence>
                {provided.placeholder}
              </Paper>
            )}
          </Droppable>
        ))}
      </Box>
    </DragDropContext>
  );
};

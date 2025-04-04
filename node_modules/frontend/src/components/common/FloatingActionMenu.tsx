import React from 'react';
import { Box, Fab, Tooltip } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

interface ActionItem {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  color?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
}

interface FloatingActionMenuProps {
  actions: ActionItem[];
}

export const FloatingActionMenu: React.FC<FloatingActionMenuProps> = ({ actions }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 1000
      }}
    >
      <AnimatePresence>
        {isOpen && (
          <Box sx={{ mb: 2 }}>
            {actions.map((action, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20, scale: 0 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0 }}
                transition={{
                  delay: index * 0.1,
                  type: 'spring',
                  stiffness: 260,
                  damping: 20
                }}
              >
                <Tooltip title={action.label} placement="left">
                  <Fab
                    color={action.color || 'primary'}
                    size="small"
                    onClick={action.onClick}
                    sx={{ mb: 1, display: 'block' }}
                  >
                    {action.icon}
                  </Fab>
                </Tooltip>
              </motion.div>
            ))}
          </Box>
        )}
      </AnimatePresence>

      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Fab
          color="primary"
          onClick={() => setIsOpen(!isOpen)}
          sx={{
            transition: 'transform 0.2s',
            transform: isOpen ? 'rotate(45deg)' : 'none'
          }}
        >
          <AddIcon />
        </Fab>
      </motion.div>
    </Box>
  );
};

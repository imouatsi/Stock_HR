import React, { useState, useCallback } from 'react';
import {
  Dialog,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Box,
  Typography,
  Chip,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { debounce } from 'lodash';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchResult {
  id: string;
  title: string;
  type: 'user' | 'invoice' | 'contract' | 'inventory';
  path: string;
  icon: JSX.Element;
  metadata?: Record<string, any>;
}

export const SuperSearch = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const navigate = useNavigate();

  const performSearch = useCallback(
    debounce(async (searchQuery: string) => {
      if (searchQuery.length < 2) return;
      
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
        const data = await response.json();
        setResults(data);
      } catch (error) {
        console.error('Search failed:', error);
      }
    }, 300),
    []
  );

  const handleKeyPress = (e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      setOpen(true);
    }
  };

  React.useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <>
      <Box
        onClick={() => setOpen(true)}
        sx={{
          position: 'fixed',
          top: '1rem',
          left: '50%',
          transform: 'translateX(-50%)',
          cursor: 'pointer',
          zIndex: 1000,
        }}
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Chip
            icon={<SearchIcon />}
            label="Press Ctrl + K to search"
            variant="outlined"
          />
        </motion.div>
      </Box>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <Box sx={{ p: 2 }}>
          <TextField
            autoFocus
            fullWidth
            placeholder="Search anything..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              performSearch(e.target.value);
            }}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
          />

          <AnimatePresence>
            {results.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
              >
                <List>
                  {results.map((result) => (
                    <ListItem
                      key={result.id}
                      button
                      onClick={() => {
                        navigate(result.path);
                        setOpen(false);
                      }}
                    >
                      <ListItemIcon>{result.icon}</ListItemIcon>
                      <ListItemText
                        primary={result.title}
                        secondary={
                          <Typography variant="body2" color="text.secondary">
                            {result.type.charAt(0).toUpperCase() + result.type.slice(1)}
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </motion.div>
            )}
          </AnimatePresence>
        </Box>
      </Dialog>
    </>
  );
};

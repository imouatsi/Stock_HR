import React from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  IconButton,
  Tooltip,
  LinearProgress,
} from '@mui/material';
import { Edit, Delete, ContentCopy } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

interface Column {
  id: string;
  label: string;
  render?: (value: any) => React.ReactNode;
  width?: number;
}

interface DataGridProps {
  columns: Column[];
  data: any[];
  loading?: boolean;
  selectable?: boolean;
  onEdit?: (item: any) => void;
  onDelete?: (item: any) => void;
  onDuplicate?: (item: any) => void;
}

export const DataGrid: React.FC<DataGridProps> = ({
  columns,
  data,
  loading,
  selectable,
  onEdit,
  onDelete,
  onDuplicate,
}) => {
  const [selected, setSelected] = React.useState<string[]>([]);

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelected(event.target.checked ? data.map(item => item.id) : []);
  };

  const handleSelect = (id: string) => {
    setSelected(prev => 
      prev.includes(id) 
        ? prev.filter(i => i !== id)
        : [...prev, id]
    );
  };

  return (
    <Paper 
      elevation={0} 
      variant="outlined" 
      sx={{ position: 'relative', overflow: 'hidden' }}
    >
      {loading && (
        <LinearProgress 
          sx={{ position: 'absolute', top: 0, left: 0, right: 0 }} 
        />
      )}

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {selectable && (
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={selected.length > 0 && selected.length < data.length}
                    checked={selected.length === data.length}
                    onChange={handleSelectAll}
                  />
                </TableCell>
              )}
              {columns.map(column => (
                <TableCell 
                  key={column.id}
                  style={{ width: column.width }}
                >
                  {column.label}
                </TableCell>
              ))}
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <AnimatePresence>
              {data.map((row, index) => (
                <motion.tr
                  key={row.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ delay: index * 0.05 }}
                  style={{ display: 'table-row' }}
                >
                  {selectable && (
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selected.includes(row.id)}
                        onChange={() => handleSelect(row.id)}
                      />
                    </TableCell>
                  )}
                  {columns.map(column => (
                    <TableCell key={column.id}>
                      {column.render ? column.render(row[column.id]) : row[column.id]}
                    </TableCell>
                  ))}
                  <TableCell align="right">
                    <Box sx={{ '& > button': { ml: 1 } }}>
                      {onEdit && (
                        <Tooltip title="Edit">
                          <IconButton size="small" onClick={() => onEdit(row)}>
                            <Edit />
                          </IconButton>
                        </Tooltip>
                      )}
                      {onDuplicate && (
                        <Tooltip title="Duplicate">
                          <IconButton size="small" onClick={() => onDuplicate(row)}>
                            <ContentCopy />
                          </IconButton>
                        </Tooltip>
                      )}
                      {onDelete && (
                        <Tooltip title="Delete">
                          <IconButton size="small" onClick={() => onDelete(row)}>
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  </TableCell>
                </motion.tr>
              ))}
            </AnimatePresence>
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

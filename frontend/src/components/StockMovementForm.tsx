import React, { useState, useEffect } from 'react';
import {
  Box,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  FormHelperText,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { StockMovement, StockMovementCreateData, StockMovementUpdateData } from '../services/stockMovementService';
import { inventoryService } from '../services/inventoryService';

interface StockMovementFormProps {
  movement?: StockMovement;
  onChange: (data: StockMovementCreateData | StockMovementUpdateData) => void;
  errors?: Record<string, string>;
  isEdit?: boolean;
}

const StockMovementForm: React.FC<StockMovementFormProps> = ({
  movement,
  onChange,
  errors = {},
  isEdit = false,
}) => {
  const [inventoryItems, setInventoryItems] = useState<Array<{ _id: string; name: string; sku: string }>>([]);
  const [formData, setFormData] = useState<StockMovementCreateData | StockMovementUpdateData>(
    isEdit
      ? {
          notes: movement?.notes || '',
          timestamp: movement?.timestamp || new Date().toISOString(),
        }
      : {
          inventoryItem: movement?.inventoryItem?._id || '',
          quantity: movement?.quantity || 0,
          type: movement?.type || 'in',
          source: movement?.source || '',
          destination: movement?.destination || '',
          timestamp: movement?.timestamp || new Date().toISOString(),
          notes: movement?.notes || '',
        }
  );

  useEffect(() => {
    const loadInventoryItems = async () => {
      try {
        const items = await inventoryService.getAllItems();
        setInventoryItems(items);
      } catch (error) {
        console.error('Error loading inventory items:', error);
      }
    };
    loadInventoryItems();
  }, []);

  const handleChange = (field: string, value: any) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    onChange(newData);
  };

  const showTransferFields = !isEdit && 'type' in formData && formData.type === 'transfer';

  return (
    <Box sx={{ mt: 2 }}>
      <Grid container spacing={2}>
        {!isEdit && (
          <>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.inventoryItem}>
                <InputLabel>Inventory Item</InputLabel>
                <Select
                  value={'inventoryItem' in formData ? formData.inventoryItem : ''}
                  onChange={(e) => handleChange('inventoryItem', e.target.value)}
                  label="Inventory Item"
                >
                  {inventoryItems.map((item) => (
                    <MenuItem key={item._id} value={item._id}>
                      {item.name} ({item.sku})
                    </MenuItem>
                  ))}
                </Select>
                {errors.inventoryItem && (
                  <FormHelperText>{errors.inventoryItem}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.type}>
                <InputLabel>Movement Type</InputLabel>
                <Select
                  value={'type' in formData ? formData.type : ''}
                  onChange={(e) => handleChange('type', e.target.value)}
                  label="Movement Type"
                >
                  <MenuItem value="in">Stock In</MenuItem>
                  <MenuItem value="out">Stock Out</MenuItem>
                  <MenuItem value="transfer">Transfer</MenuItem>
                </Select>
                {errors.type && (
                  <FormHelperText>{errors.type}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Quantity"
                value={'quantity' in formData ? formData.quantity : 0}
                onChange={(e) => handleChange('quantity', Number(e.target.value))}
                error={!!errors.quantity}
                helperText={errors.quantity}
              />
            </Grid>
          </>
        )}

        <Grid item xs={12} sm={6}>
          <DatePicker
            label="Date"
            value={formData.timestamp ? new Date(formData.timestamp) : null}
            onChange={(date) => handleChange('timestamp', date?.toISOString())}
          />
        </Grid>

        {showTransferFields && (
          <>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Source Location"
                value={'source' in formData ? formData.source : ''}
                onChange={(e) => handleChange('source', e.target.value)}
                error={!!errors.source}
                helperText={errors.source}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Destination Location"
                value={'destination' in formData ? formData.destination : ''}
                onChange={(e) => handleChange('destination', e.target.value)}
                error={!!errors.destination}
                helperText={errors.destination}
              />
            </Grid>
          </>
        )}

        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Notes"
            value={formData.notes || ''}
            onChange={(e) => handleChange('notes', e.target.value)}
            error={!!errors.notes}
            helperText={errors.notes}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default StockMovementForm; 
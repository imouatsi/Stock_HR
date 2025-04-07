import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/features/store';
import { addItemStart, updateItemStart } from '@/features/slices/inventorySlice';

const stockSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  quantity: z.number().min(0, 'Quantity must be positive'),
  unitPrice: z.number().min(0, 'Unit price must be positive'),
  category: z.string().min(1, 'Category is required'),
  supplier: z.string().min(1, 'Supplier is required'),
  reorderPoint: z.number().min(0, 'Reorder point must be positive'),
  unit: z.string().min(1, 'Unit is required'),
});

type StockFormData = z.infer<typeof stockSchema>;

const categories = [
  'Raw Materials',
  'Finished Goods',
  'Packaging',
  'Spare Parts',
  'Office Supplies',
];

const units = ['Pieces', 'Kilograms', 'Liters', 'Meters', 'Boxes'];

export function StockForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { selectedItem, isLoading, error } = useSelector(
    (state: RootState) => state.inventory
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<StockFormData>({
    resolver: zodResolver(stockSchema),
  });

  useEffect(() => {
    if (id && selectedItem) {
      Object.entries(selectedItem).forEach(([key, value]) => {
        setValue(key as keyof StockFormData, value);
      });
    }
  }, [id, selectedItem, setValue]);

  const onSubmit = async (data: StockFormData) => {
    if (id) {
      dispatch(updateItemStart({ id, data }));
    } else {
      dispatch(addItemStart(data));
    }
    navigate('/stock');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{id ? 'Edit Stock Item' : 'New Stock Item'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              {...register('name')}
              placeholder="Enter item name"
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              {...register('description')}
              placeholder="Enter item description"
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                {...register('quantity', { valueAsNumber: true })}
                placeholder="Enter quantity"
              />
              {errors.quantity && (
                <p className="text-sm text-destructive">{errors.quantity.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="unitPrice">Unit Price</Label>
              <Input
                id="unitPrice"
                type="number"
                {...register('unitPrice', { valueAsNumber: true })}
                placeholder="Enter unit price"
              />
              {errors.unitPrice && (
                <p className="text-sm text-destructive">{errors.unitPrice.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                onValueChange={(value) => setValue('category', value)}
                defaultValue={selectedItem?.category}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-sm text-destructive">{errors.category.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="unit">Unit</Label>
              <Select
                onValueChange={(value) => setValue('unit', value)}
                defaultValue={selectedItem?.unit}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  {units.map((unit) => (
                    <SelectItem key={unit} value={unit}>
                      {unit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.unit && (
                <p className="text-sm text-destructive">{errors.unit.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="supplier">Supplier</Label>
            <Input
              id="supplier"
              {...register('supplier')}
              placeholder="Enter supplier name"
            />
            {errors.supplier && (
              <p className="text-sm text-destructive">{errors.supplier.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="reorderPoint">Reorder Point</Label>
            <Input
              id="reorderPoint"
              type="number"
              {...register('reorderPoint', { valueAsNumber: true })}
              placeholder="Enter reorder point"
            />
            {errors.reorderPoint && (
              <p className="text-sm text-destructive">{errors.reorderPoint.message}</p>
            )}
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/stock')}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

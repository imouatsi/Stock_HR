import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { DocumentSchema, Document, DocumentItem, Client } from '@/types/core.types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formatCurrency } from '@/utils/format';
import { qrService } from '@/services/qr.service';
import { auditService } from '@/services/audit.service';

interface DocumentFormProps {
  initialData?: Document;
  onSubmit: (data: Document) => Promise<void>;
}

export const DocumentForm: React.FC<DocumentFormProps> = ({ initialData, onSubmit }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<Document>({
    resolver: zodResolver(DocumentSchema),
    defaultValues: initialData || {
      type: 'proforma',
      client: {
        name: '',
        address: '',
        nif: '',
      },
      items: [],
      paymentTerms: '',
      dueDate: new Date(),
      status: 'draft',
    },
  });

  const handleSubmit = async (data: Document) => {
    try {
      setLoading(true);
      setError(null);

      // Generate QR code for new documents
      if (!initialData) {
        const qrData = {
          type: data.type,
          documentNumber: data.type === 'proforma' ? 'PROF-' : 'INV-' + Date.now(),
          amount: data.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0),
          date: data.dueDate.toISOString(),
          clientName: data.client.name,
          clientNif: data.client.nif || '',
        };
        data.qrCode = await qrService.generateQRCode(JSON.stringify(qrData));
      }

      await onSubmit(data);
      await auditService.logAction(
        initialData ? 'UPDATE_DOCUMENT' : 'CREATE_DOCUMENT',
        'Document',
        initialData?.id || 'new',
        { type: data.type, status: data.status }
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const addItem = () => {
    const items = form.getValues('items');
    form.setValue('items', [
      ...items,
      {
        description: '',
        quantity: 1,
        unitPrice: 0,
      },
    ]);
  };

  const removeItem = (index: number) => {
    const items = form.getValues('items');
    form.setValue('items', items.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>{t('document.type')}</Label>
          <Select
            value={form.watch('type')}
            onValueChange={(value) => form.setValue('type', value as Document['type'])}
          >
            <SelectTrigger>
              <SelectValue placeholder={t('document.type')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="proforma">{t('document.type.proforma')}</SelectItem>
              <SelectItem value="final">{t('document.type.final')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>{t('document.status')}</Label>
          <Select
            value={form.watch('status')}
            onValueChange={(value) => form.setValue('status', value as Document['status'])}
          >
            <SelectTrigger>
              <SelectValue placeholder={t('document.status')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">{t('document.status.draft')}</SelectItem>
              <SelectItem value="pending">{t('document.status.pending')}</SelectItem>
              <SelectItem value="approved">{t('document.status.approved')}</SelectItem>
              <SelectItem value="rejected">{t('document.status.rejected')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">{t('document.client')}</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>{t('document.client.name')}</Label>
            <Input {...form.register('client.name')} />
            {form.formState.errors.client?.name && (
              <p className="text-sm text-red-500">{t('document.errors.required')}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>{t('document.client.nif')}</Label>
            <Input {...form.register('client.nif')} />
          </div>

          <div className="col-span-2 space-y-2">
            <Label>{t('document.client.address')}</Label>
            <Input {...form.register('client.address')} />
            {form.formState.errors.client?.address && (
              <p className="text-sm text-red-500">{t('document.errors.required')}</p>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">{t('document.items')}</h3>
          <Button type="button" onClick={addItem}>
            {t('document.items.add')}
          </Button>
        </div>

        {form.watch('items').map((_, index) => (
          <div key={index} className="grid grid-cols-4 gap-4 items-end">
            <div className="space-y-2">
              <Label>{t('document.items.description')}</Label>
              <Input {...form.register(`items.${index}.description`)} />
            </div>

            <div className="space-y-2">
              <Label>{t('document.items.quantity')}</Label>
              <Input
                type="number"
                min="1"
                {...form.register(`items.${index}.quantity`, { valueAsNumber: true })}
              />
            </div>

            <div className="space-y-2">
              <Label>{t('document.items.unitPrice')}</Label>
              <Input
                type="number"
                min="0"
                step="0.01"
                {...form.register(`items.${index}.unitPrice`, { valueAsNumber: true })}
              />
            </div>

            <div className="space-y-2">
              <Label>{t('document.items.barcode')}</Label>
              <Input {...form.register(`items.${index}.barcode`)} />
            </div>

            <Button
              type="button"
              variant="destructive"
              onClick={() => removeItem(index)}
              className="col-span-4"
            >
              {t('document.items.remove')}
            </Button>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>{t('document.paymentTerms')}</Label>
          <Input {...form.register('paymentTerms')} />
          {form.formState.errors.paymentTerms && (
            <p className="text-sm text-red-500">{t('document.errors.required')}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>{t('document.dueDate')}</Label>
          <Input
            type="date"
            {...form.register('dueDate', { valueAsDate: true })}
          />
          {form.formState.errors.dueDate && (
            <p className="text-sm text-red-500">{t('document.errors.required')}</p>
          )}
        </div>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={() => form.reset()}>
          {t('document.actions.reset')}
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? t('document.actions.saving') : t('document.actions.save')}
        </Button>
      </div>
    </form>
  );
}; 
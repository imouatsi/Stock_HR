import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Proforma {
  id: string;
  number: string;
  date: string;
  client: string;
  amount: number;
  status: 'draft' | 'sent' | 'accepted' | 'rejected';
}

const Proforma: React.FC = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [proformas, setProformas] = useState<Proforma[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddProforma = () => {
    // TODO: Implement add proforma functionality
    toast({
      title: t('common.notImplemented'),
      description: t('common.featureComingSoon'),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{t('accounting.proforma.title')}</h1>
        <Button onClick={handleAddProforma}>
          {t('accounting.proforma.addProforma')}
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('accounting.proforma.number')}</TableHead>
              <TableHead>{t('accounting.proforma.date')}</TableHead>
              <TableHead>{t('accounting.proforma.client')}</TableHead>
              <TableHead>{t('accounting.proforma.amount')}</TableHead>
              <TableHead>{t('accounting.proforma.status')}</TableHead>
              <TableHead className="text-right">{t('common.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {proformas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  {t('common.noData')}
                </TableCell>
              </TableRow>
            ) : (
              proformas.map((proforma) => (
                <TableRow key={proforma.id}>
                  <TableCell>{proforma.number}</TableCell>
                  <TableCell>{proforma.date}</TableCell>
                  <TableCell>{proforma.client}</TableCell>
                  <TableCell>${proforma.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        proforma.status === 'accepted'
                          ? 'bg-green-100 text-green-800'
                          : proforma.status === 'rejected'
                          ? 'bg-red-100 text-red-800'
                          : proforma.status === 'sent'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {t(`accounting.proforma.status.${proforma.status}`)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        // TODO: Implement edit functionality
                        toast({
                          title: t('common.notImplemented'),
                          description: t('common.featureComingSoon'),
                        });
                      }}
                    >
                      {t('common.edit')}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Proforma; 
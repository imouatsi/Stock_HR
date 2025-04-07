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

interface JournalEntry {
  id: string;
  date: string;
  reference: string;
  description: string;
  debit: number;
  credit: number;
  account: string;
}

const JournalEntries: React.FC = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddEntry = () => {
    // TODO: Implement add entry functionality
    toast({
      title: t('common.notImplemented'),
      description: t('common.featureComingSoon'),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{t('accounting.journalEntries.title')}</h1>
        <Button onClick={handleAddEntry}>
          {t('accounting.journalEntries.addEntry')}
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('accounting.journalEntries.date')}</TableHead>
              <TableHead>{t('accounting.journalEntries.reference')}</TableHead>
              <TableHead>{t('accounting.journalEntries.description')}</TableHead>
              <TableHead>{t('accounting.journalEntries.account')}</TableHead>
              <TableHead className="text-right">{t('accounting.journalEntries.debit')}</TableHead>
              <TableHead className="text-right">{t('accounting.journalEntries.credit')}</TableHead>
              <TableHead className="text-right">{t('common.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  {t('common.noData')}
                </TableCell>
              </TableRow>
            ) : (
              entries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>{entry.date}</TableCell>
                  <TableCell>{entry.reference}</TableCell>
                  <TableCell>{entry.description}</TableCell>
                  <TableCell>{entry.account}</TableCell>
                  <TableCell className="text-right">${entry.debit.toFixed(2)}</TableCell>
                  <TableCell className="text-right">${entry.credit.toFixed(2)}</TableCell>
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

export default JournalEntries; 
import React, { useState, useEffect } from 'react';
import { accountingService } from '@/services/accountingService';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { JournalEntry, JournalEntryLine, SCFAccount, AccountingPeriod } from '@/types/accounting';
import { PlusCircle, Trash2, AlertCircle } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

// Interface for the simplified journal entry display
interface JournalEntryDisplay {
  id: string;
  date: string;
  reference: string;
  description: string;
  periodId: string;
  periodName: string;
  totalDebit: number;
  totalCredit: number;
  isBalanced: boolean;
  createdAt: string;
}

// Interface for the form data
interface JournalEntryFormData {
  reference: string;
  date: string;
  description: string;
  periodId: string;
  lines: {
    accountId: string;
    description: string;
    debit: number;
    credit: number;
  }[];
}

const JournalEntries: React.FC = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [entries, setEntries] = useState<JournalEntryDisplay[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [accounts, setAccounts] = useState<SCFAccount[]>([]);
  const [periods, setPeriods] = useState<AccountingPeriod[]>([]);
  const [formData, setFormData] = useState<JournalEntryFormData>({
    reference: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    periodId: '',
    lines: [{ accountId: '', description: '', debit: 0, credit: 0 }]
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [lineErrors, setLineErrors] = useState<Record<string, Record<string, string>>>({});

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setIsLoading(true);

      // Fetch journal entries, accounts, and periods in parallel
      const [journalEntriesData, accountsData, periodsData] = await Promise.all([
        accountingService.getAllJournalEntries(),
        accountingService.getAllChartOfAccounts(),
        accountingService.getAllAccountingPeriods()
      ]);

      // Set accounts and periods
      setAccounts(accountsData);
      setPeriods(periodsData);

      // Set default period to current month
      const currentMonth = new Date().getMonth() + 1;
      const currentYear = new Date().getFullYear();
      const currentPeriodId = `P-${currentYear}-${currentMonth.toString().padStart(2, '0')}`;
      const currentPeriod = periodsData.find(p => p._id === currentPeriodId);

      if (currentPeriod) {
        setFormData(prev => ({
          ...prev,
          periodId: currentPeriodId
        }));
      }

      // Transform journal entries for display
      setEntries(journalEntriesData.map(entry => {
        // Find period name
        const period = periodsData.find(p => p._id === entry.periodId);

        return {
          id: entry._id || '',
          date: entry.date,
          reference: entry.reference,
          description: entry.description,
          periodId: entry.periodId,
          periodName: period?.name || entry.periodId,
          totalDebit: entry.totalDebit,
          totalCredit: entry.totalCredit,
          isBalanced: entry.isBalanced,
          createdAt: entry.createdAt || ''
        };
      }));
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: t('common.error.title'),
        description: t('common.error.loading'),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-DZ', {
      style: 'currency',
      currency: 'DZD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-DZ');
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      reference: `JE-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      date: new Date().toISOString().split('T')[0],
      description: '',
      periodId: formData.periodId, // Keep the current period
      lines: [{ accountId: '', description: '', debit: 0, credit: 0 }]
    });
    setFormErrors({});
    setLineErrors({});
  };

  // Handle opening the add entry dialog
  const handleAddEntry = () => {
    setSelectedEntry(null);
    resetForm();
    setIsDialogOpen(true);
  };

  // Handle opening the edit entry dialog
  const handleEditEntry = async (entryId: string) => {
    try {
      setIsLoading(true);
      const entry = await accountingService.getJournalEntryById(entryId);
      if (entry) {
        setSelectedEntry(entry);
        setFormData({
          reference: entry.reference,
          date: entry.date,
          description: entry.description,
          periodId: entry.periodId,
          lines: entry.lines.map(line => ({
            accountId: line.accountId,
            description: line.description,
            debit: line.debit,
            credit: line.credit
          }))
        });
        setIsDialogOpen(true);
      }
    } catch (error) {
      console.error('Error fetching journal entry:', error);
      toast({
        title: t('common.error.title'),
        description: t('accounting.journalEntries.error.loading'),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error for this field if it exists
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error for this field if it exists
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Handle line input changes
  const handleLineInputChange = (index: number, name: string, value: string | number) => {
    setFormData(prev => {
      const newLines = [...prev.lines];
      newLines[index] = {
        ...newLines[index],
        [name]: name === 'debit' || name === 'credit' ? parseFloat(value as string) || 0 : value
      };
      return {
        ...prev,
        lines: newLines
      };
    });

    // Clear error for this line field if it exists
    if (lineErrors[index]?.[name]) {
      setLineErrors(prev => {
        const newErrors = { ...prev };
        if (newErrors[index]) {
          delete newErrors[index][name];
          if (Object.keys(newErrors[index]).length === 0) {
            delete newErrors[index];
          }
        }
        return newErrors;
      });
    }
  };

  // Add a new line
  const addLine = () => {
    setFormData(prev => ({
      ...prev,
      lines: [...prev.lines, { accountId: '', description: '', debit: 0, credit: 0 }]
    }));
  };

  // Remove a line
  const removeLine = (index: number) => {
    if (formData.lines.length <= 1) {
      return; // Keep at least one line
    }

    setFormData(prev => {
      const newLines = [...prev.lines];
      newLines.splice(index, 1);
      return {
        ...prev,
        lines: newLines
      };
    });

    // Remove errors for this line
    setLineErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[index];
      // Adjust indices for lines after the removed one
      const adjustedErrors: Record<string, Record<string, string>> = {};
      Object.keys(newErrors).forEach(key => {
        const keyIndex = parseInt(key);
        if (keyIndex > index) {
          adjustedErrors[keyIndex - 1] = newErrors[keyIndex];
        } else if (keyIndex < index) {
          adjustedErrors[keyIndex] = newErrors[keyIndex];
        }
      });
      return adjustedErrors;
    });
  };

  // Calculate totals
  const calculateTotals = () => {
    let totalDebit = 0;
    let totalCredit = 0;

    formData.lines.forEach(line => {
      totalDebit += line.debit || 0;
      totalCredit += line.credit || 0;
    });

    return { totalDebit, totalCredit };
  };

  // Check if entry is balanced
  const isBalanced = () => {
    const { totalDebit, totalCredit } = calculateTotals();
    return Math.abs(totalDebit - totalCredit) < 0.01; // Allow for small rounding errors
  };

  // Validate form
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    const lineErrorsObj: Record<string, Record<string, string>> = {};

    // Validate main fields
    if (!formData.reference) {
      errors.reference = t('accounting.journalEntries.error.referenceRequired');
    }

    if (!formData.date) {
      errors.date = t('accounting.journalEntries.error.dateRequired');
    }

    if (!formData.description) {
      errors.description = t('accounting.journalEntries.error.descriptionRequired');
    }

    if (!formData.periodId) {
      errors.periodId = t('accounting.journalEntries.error.periodRequired');
    }

    // Validate lines
    formData.lines.forEach((line, index) => {
      const lineErrors: Record<string, string> = {};

      if (!line.accountId) {
        lineErrors.accountId = t('accounting.journalEntries.error.accountRequired');
      }

      if (!line.description) {
        lineErrors.description = t('accounting.journalEntries.error.lineDescriptionRequired');
      }

      if (line.debit === 0 && line.credit === 0) {
        lineErrors.debit = t('accounting.journalEntries.error.amountRequired');
        lineErrors.credit = t('accounting.journalEntries.error.amountRequired');
      }

      if (line.debit > 0 && line.credit > 0) {
        lineErrors.debit = t('accounting.journalEntries.error.bothDebitCredit');
        lineErrors.credit = t('accounting.journalEntries.error.bothDebitCredit');
      }

      if (Object.keys(lineErrors).length > 0) {
        lineErrorsObj[index] = lineErrors;
      }
    });

    // Check if entry is balanced
    if (!isBalanced()) {
      errors.balance = t('accounting.journalEntries.error.notBalanced');
    }

    setFormErrors(errors);
    setLineErrors(lineErrorsObj);

    return Object.keys(errors).length === 0 && Object.keys(lineErrorsObj).length === 0;
  };

  // Save journal entry
  const handleSaveEntry = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const { totalDebit, totalCredit } = calculateTotals();

      // Prepare data for API
      const entryData: Partial<JournalEntry> = {
        reference: formData.reference,
        date: formData.date,
        description: formData.description,
        periodId: formData.periodId,
        lines: await Promise.all(formData.lines.map(async line => {
          // Get account details
          const account = accounts.find(a => a._id === line.accountId);

          return {
            accountId: line.accountId,
            accountCode: account?.code || '',
            accountLabel: account?.label || '',
            description: line.description,
            debit: line.debit,
            credit: line.credit
          };
        })),
        totalDebit,
        totalCredit,
        isBalanced: isBalanced(),
        createdBy: 'user' // In a real app, this would be the current user's ID
      };

      if (selectedEntry) {
        // Update existing entry
        await accountingService.updateJournalEntry(selectedEntry._id || '', entryData);
        toast({
          title: t('common.success'),
          description: t('accounting.journalEntries.success.updated'),
        });
      } else {
        // Create new entry
        await accountingService.createJournalEntry(entryData);
        toast({
          title: t('common.success'),
          description: t('accounting.journalEntries.success.created'),
        });
      }

      // Refresh entries and close dialog
      fetchInitialData();
      setIsDialogOpen(false);
    } catch (error: any) {
      toast({
        title: t('common.error.title'),
        description: error.message || t('common.error.saving'),
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t('accounting.journalEntries.title')}</h1>
          <p className="text-sm text-muted-foreground">{t('accounting.journalEntries.description')}</p>
        </div>
        <Button onClick={handleAddEntry}>
          {t('accounting.journalEntries.addEntry')}
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('accounting.journalEntries.date')}</TableHead>
                <TableHead>{t('accounting.journalEntries.reference')}</TableHead>
                <TableHead>{t('accounting.journalEntries.description')}</TableHead>
                <TableHead>{t('accounting.journalEntries.period')}</TableHead>
                <TableHead className="text-right">{t('accounting.journalEntries.debit')}</TableHead>
                <TableHead className="text-right">{t('accounting.journalEntries.credit')}</TableHead>
                <TableHead className="text-center">{t('accounting.journalEntries.status')}</TableHead>
                <TableHead className="text-right">{t('common.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center">
                    {t('common.noData')}
                  </TableCell>
                </TableRow>
              ) : (
                entries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>{formatDate(entry.date)}</TableCell>
                    <TableCell>{entry.reference}</TableCell>
                    <TableCell>{entry.description}</TableCell>
                    <TableCell>{entry.periodName}</TableCell>
                    <TableCell className="text-right font-mono">{formatCurrency(entry.totalDebit)}</TableCell>
                    <TableCell className="text-right font-mono">{formatCurrency(entry.totalCredit)}</TableCell>
                    <TableCell className="text-center">
                      {entry.isBalanced ? (
                        <Badge className="bg-green-100 text-green-800">
                          {t('accounting.journalEntries.balanced')}
                        </Badge>
                      ) : (
                        <Badge className="bg-red-100 text-red-800">
                          {t('accounting.journalEntries.notBalanced')}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditEntry(entry.id)}
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
      )}

      {/* Journal Entry Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>
              {selectedEntry ? t('accounting.journalEntries.editEntry') : t('accounting.journalEntries.addEntry')}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-3 gap-4">
              {/* Reference */}
              <div className="space-y-2">
                <Label htmlFor="reference">{t('accounting.journalEntries.reference')}</Label>
                <Input
                  id="reference"
                  name="reference"
                  value={formData.reference}
                  onChange={handleInputChange}
                  className={formErrors.reference ? 'border-red-500' : ''}
                />
                {formErrors.reference && <p className="text-sm text-red-500">{formErrors.reference}</p>}
              </div>

              {/* Date */}
              <div className="space-y-2">
                <Label htmlFor="date">{t('accounting.journalEntries.date')}</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className={formErrors.date ? 'border-red-500' : ''}
                />
                {formErrors.date && <p className="text-sm text-red-500">{formErrors.date}</p>}
              </div>

              {/* Period */}
              <div className="space-y-2">
                <Label htmlFor="periodId">{t('accounting.journalEntries.period')}</Label>
                <Select
                  value={formData.periodId}
                  onValueChange={(value) => handleSelectChange('periodId', value)}
                >
                  <SelectTrigger id="periodId" className={formErrors.periodId ? 'border-red-500' : ''}>
                    <SelectValue placeholder={t('accounting.journalEntries.selectPeriod')} />
                  </SelectTrigger>
                  <SelectContent>
                    {periods.map((period) => (
                      <SelectItem
                        key={period._id}
                        value={period._id || ''}
                        disabled={period.isClosed}
                      >
                        {period.name} {period.isClosed && `(${t('accounting.accountingPeriods.closed')})`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.periodId && <p className="text-sm text-red-500">{formErrors.periodId}</p>}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">{t('accounting.journalEntries.description')}</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={2}
                className={formErrors.description ? 'border-red-500' : ''}
              />
              {formErrors.description && <p className="text-sm text-red-500">{formErrors.description}</p>}
            </div>

            {/* Journal Entry Lines */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>{t('accounting.journalEntries.lines')}</Label>
                <Button type="button" variant="outline" size="sm" onClick={addLine}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  {t('accounting.journalEntries.addLine')}
                </Button>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('accounting.journalEntries.account')}</TableHead>
                      <TableHead>{t('accounting.journalEntries.description')}</TableHead>
                      <TableHead className="text-right">{t('accounting.journalEntries.debit')}</TableHead>
                      <TableHead className="text-right">{t('accounting.journalEntries.credit')}</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {formData.lines.map((line, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Select
                            value={line.accountId}
                            onValueChange={(value) => handleLineInputChange(index, 'accountId', value)}
                          >
                            <SelectTrigger className={lineErrors[index]?.accountId ? 'border-red-500' : ''}>
                              <SelectValue placeholder={t('accounting.journalEntries.selectAccount')} />
                            </SelectTrigger>
                            <SelectContent>
                              {accounts.map((account) => (
                                <SelectItem key={account._id} value={account._id || ''}>
                                  {account.code} - {account.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {lineErrors[index]?.accountId && (
                            <p className="text-xs text-red-500 mt-1">{lineErrors[index].accountId}</p>
                          )}
                        </TableCell>
                        <TableCell>
                          <Input
                            value={line.description}
                            onChange={(e) => handleLineInputChange(index, 'description', e.target.value)}
                            placeholder={t('accounting.journalEntries.lineDescription')}
                            className={lineErrors[index]?.description ? 'border-red-500' : ''}
                          />
                          {lineErrors[index]?.description && (
                            <p className="text-xs text-red-500 mt-1">{lineErrors[index].description}</p>
                          )}
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={line.debit || ''}
                            onChange={(e) => handleLineInputChange(index, 'debit', e.target.value)}
                            className={`text-right ${lineErrors[index]?.debit ? 'border-red-500' : ''}`}
                          />
                          {lineErrors[index]?.debit && (
                            <p className="text-xs text-red-500 mt-1">{lineErrors[index].debit}</p>
                          )}
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={line.credit || ''}
                            onChange={(e) => handleLineInputChange(index, 'credit', e.target.value)}
                            className={`text-right ${lineErrors[index]?.credit ? 'border-red-500' : ''}`}
                          />
                          {lineErrors[index]?.credit && (
                            <p className="text-xs text-red-500 mt-1">{lineErrors[index].credit}</p>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeLine(index)}
                            disabled={formData.lines.length <= 1}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Totals */}
              <div className="flex justify-end space-x-4 pt-2">
                <div>
                  <span className="font-medium">{t('accounting.journalEntries.totalDebit')}:</span>{' '}
                  <span className="font-mono">{formatCurrency(calculateTotals().totalDebit)}</span>
                </div>
                <div>
                  <span className="font-medium">{t('accounting.journalEntries.totalCredit')}:</span>{' '}
                  <span className="font-mono">{formatCurrency(calculateTotals().totalCredit)}</span>
                </div>
                <div>
                  <span className="font-medium">{t('accounting.journalEntries.difference')}:</span>{' '}
                  <span className={`font-mono ${isBalanced() ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(Math.abs(calculateTotals().totalDebit - calculateTotals().totalCredit))}
                  </span>
                </div>
              </div>

              {/* Balance error */}
              {formErrors.balance && (
                <div className="flex items-center text-red-500 mt-2">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  <p className="text-sm">{formErrors.balance}</p>
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button onClick={handleSaveEntry}>
              {t('common.save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default JournalEntries;
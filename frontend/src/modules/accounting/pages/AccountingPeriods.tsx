import React, { useState, useEffect } from 'react';
import { accountingService } from '@/services/accountingService';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { AccountingPeriod } from '@/types/accounting';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const AccountingPeriods: React.FC = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [periods, setPeriods] = useState<AccountingPeriod[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<AccountingPeriod | null>(null);
  const [formData, setFormData] = useState<Partial<AccountingPeriod>>({
    name: '',
    startDate: '',
    endDate: '',
    isClosed: false
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchPeriods();
  }, []);

  const fetchPeriods = async () => {
    try {
      setIsLoading(true);
      const data = await accountingService.getAllAccountingPeriods();
      setPeriods(data);
    } catch (error) {
      toast({
        title: t('common.error.title'),
        description: t('common.error.loading'),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-DZ');
  };

  // Handle opening the add period dialog
  const handleAddPeriod = () => {
    setSelectedPeriod(null);
    setFormData({
      name: '',
      startDate: '',
      endDate: '',
      isClosed: false
    });
    setFormErrors({});
    setIsDialogOpen(true);
  };

  // Handle opening the edit period dialog
  const handleEditPeriod = (period: AccountingPeriod) => {
    setSelectedPeriod(period);
    setFormData({
      name: period.name,
      startDate: period.startDate,
      endDate: period.endDate,
      isClosed: period.isClosed
    });
    setFormErrors({});
    setIsDialogOpen(true);
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
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

  // Validate form
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!formData.name) {
      errors.name = t('accounting.accountingPeriods.error.nameRequired');
    }
    
    if (!formData.startDate) {
      errors.startDate = t('accounting.accountingPeriods.error.startDateRequired');
    }
    
    if (!formData.endDate) {
      errors.endDate = t('accounting.accountingPeriods.error.endDateRequired');
    }
    
    if (formData.startDate && formData.endDate && new Date(formData.startDate) > new Date(formData.endDate)) {
      errors.endDate = t('accounting.accountingPeriods.error.startDateBeforeEndDate');
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Save period
  const handleSavePeriod = async () => {
    if (!validateForm()) {
      return;
    }
    
    try {
      if (selectedPeriod) {
        // Update existing period
        await accountingService.updateAccountingPeriod(selectedPeriod._id || '', formData);
        toast({
          title: t('common.success'),
          description: t('accounting.accountingPeriods.success.updated'),
        });
      } else {
        // Create new period
        await accountingService.createAccountingPeriod(formData);
        toast({
          title: t('common.success'),
          description: t('accounting.accountingPeriods.success.created'),
        });
      }
      
      // Refresh periods and close dialog
      fetchPeriods();
      setIsDialogOpen(false);
    } catch (error: any) {
      toast({
        title: t('common.error.title'),
        description: error.message || t('common.error.saving'),
        variant: 'destructive',
      });
    }
  };

  // Close period
  const handleClosePeriod = async (period: AccountingPeriod) => {
    try {
      await accountingService.closeAccountingPeriod(period._id || '');
      toast({
        title: t('common.success'),
        description: t('accounting.accountingPeriods.success.closed'),
      });
      
      // Refresh periods
      fetchPeriods();
    } catch (error: any) {
      toast({
        title: t('common.error.title'),
        description: error.message || t('accounting.accountingPeriods.error.closing'),
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t('accounting.accountingPeriods.title')}</h1>
          <p className="text-sm text-muted-foreground">{t('accounting.accountingPeriods.description')}</p>
        </div>
        <Button onClick={handleAddPeriod}>
          {t('accounting.accountingPeriods.addPeriod')}
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
                <TableHead>{t('accounting.accountingPeriods.name')}</TableHead>
                <TableHead>{t('accounting.accountingPeriods.startDate')}</TableHead>
                <TableHead>{t('accounting.accountingPeriods.endDate')}</TableHead>
                <TableHead>{t('accounting.accountingPeriods.status')}</TableHead>
                <TableHead>{t('accounting.accountingPeriods.closedBy')}</TableHead>
                <TableHead>{t('accounting.accountingPeriods.closedAt')}</TableHead>
                <TableHead className="text-right">{t('common.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {periods.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    {t('common.noData')}
                  </TableCell>
                </TableRow>
              ) : (
                periods.map((period) => (
                  <TableRow key={period._id}>
                    <TableCell>{period.name}</TableCell>
                    <TableCell>{formatDate(period.startDate)}</TableCell>
                    <TableCell>{formatDate(period.endDate)}</TableCell>
                    <TableCell>
                      {period.isClosed ? (
                        <Badge className="bg-red-100 text-red-800">
                          {t('accounting.accountingPeriods.closed')}
                        </Badge>
                      ) : (
                        <Badge className="bg-green-100 text-green-800">
                          {t('accounting.accountingPeriods.open')}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>{period.closedBy || '-'}</TableCell>
                    <TableCell>{period.closedAt ? formatDate(period.closedAt) : '-'}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditPeriod(period)}
                          disabled={period.isClosed}
                        >
                          {t('common.edit')}
                        </Button>
                        {!period.isClosed && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleClosePeriod(period)}
                          >
                            {t('accounting.accountingPeriods.close')}
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
      
      {/* Period Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {selectedPeriod ? t('accounting.accountingPeriods.editPeriod') : t('accounting.accountingPeriods.addPeriod')}
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            {/* Period Name */}
            <div className="space-y-2">
              <Label htmlFor="name">{t('accounting.accountingPeriods.name')}</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={formErrors.name ? 'border-red-500' : ''}
              />
              {formErrors.name && <p className="text-sm text-red-500">{formErrors.name}</p>}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {/* Start Date */}
              <div className="space-y-2">
                <Label htmlFor="startDate">{t('accounting.accountingPeriods.startDate')}</Label>
                <Input
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className={formErrors.startDate ? 'border-red-500' : ''}
                />
                {formErrors.startDate && <p className="text-sm text-red-500">{formErrors.startDate}</p>}
              </div>
              
              {/* End Date */}
              <div className="space-y-2">
                <Label htmlFor="endDate">{t('accounting.accountingPeriods.endDate')}</Label>
                <Input
                  id="endDate"
                  name="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  className={formErrors.endDate ? 'border-red-500' : ''}
                />
                {formErrors.endDate && <p className="text-sm text-red-500">{formErrors.endDate}</p>}
              </div>
            </div>
            
            {/* Is Closed */}
            {selectedPeriod && (
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isClosed"
                  name="isClosed"
                  checked={formData.isClosed}
                  onChange={handleInputChange}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <Label htmlFor="isClosed">{t('accounting.accountingPeriods.isClosed')}</Label>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button onClick={handleSavePeriod}>
              {t('common.save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AccountingPeriods;

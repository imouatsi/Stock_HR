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
import { SCFAccount, AccountType, SCFClass } from '@/types/accounting';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

// SCF Chart of Accounts Component
const ChartOfAccounts: React.FC = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [accounts, setAccounts] = useState<SCFAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<SCFAccount | null>(null);
  const [formData, setFormData] = useState<Partial<SCFAccount>>({
    code: '',
    label: '',
    type: AccountType.ASSET,
    scfClass: SCFClass.CLASS_1,
    isParent: false,
    parentId: undefined,
    balance: 0,
    description: '',
    isActive: true
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      setIsLoading(true);
      const data = await accountingService.getAllChartOfAccounts();
      setAccounts(data);
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

  // Get parent accounts for dropdown
  const getParentAccounts = () => {
    return accounts.filter(account => account.isParent);
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-DZ', {
      style: 'currency',
      currency: 'DZD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Get account type badge color
  const getAccountTypeColor = (type: AccountType) => {
    switch (type) {
      case AccountType.ASSET:
        return 'bg-blue-100 text-blue-800';
      case AccountType.LIABILITY:
        return 'bg-red-100 text-red-800';
      case AccountType.EQUITY:
        return 'bg-green-100 text-green-800';
      case AccountType.INCOME:
        return 'bg-purple-100 text-purple-800';
      case AccountType.EXPENSE:
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get SCF class badge color
  const getSCFClassColor = (scfClass: SCFClass) => {
    switch (scfClass) {
      case SCFClass.CLASS_1:
        return 'bg-indigo-100 text-indigo-800';
      case SCFClass.CLASS_2:
        return 'bg-pink-100 text-pink-800';
      case SCFClass.CLASS_3:
        return 'bg-yellow-100 text-yellow-800';
      case SCFClass.CLASS_4:
        return 'bg-cyan-100 text-cyan-800';
      case SCFClass.CLASS_5:
        return 'bg-emerald-100 text-emerald-800';
      case SCFClass.CLASS_6:
        return 'bg-amber-100 text-amber-800';
      case SCFClass.CLASS_7:
        return 'bg-violet-100 text-violet-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Handle opening the add account dialog
  const handleAddAccount = () => {
    setSelectedAccount(null);
    setFormData({
      code: '',
      label: '',
      type: AccountType.ASSET,
      scfClass: SCFClass.CLASS_1,
      isParent: false,
      parentId: undefined,
      balance: 0,
      description: '',
      isActive: true
    });
    setFormErrors({});
    setIsDialogOpen(true);
  };

  // Handle opening the edit account dialog
  const handleEditAccount = (account: SCFAccount) => {
    setSelectedAccount(account);
    setFormData({
      code: account.code,
      label: account.label,
      type: account.type,
      scfClass: account.scfClass,
      isParent: account.isParent,
      parentId: account.parentId,
      balance: account.balance,
      description: account.description || '',
      isActive: account.isActive
    });
    setFormErrors({});
    setIsDialogOpen(true);
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'balance' ? parseFloat(value) || 0 : value
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

    // If changing SCF class, update code prefix
    if (name === 'scfClass' && formData.code) {
      // Only update if the code doesn't already start with the new class
      if (!formData.code.startsWith(value)) {
        // Keep the rest of the code after the first digit
        const restOfCode = formData.code.substring(1);
        setFormData(prev => ({
          ...prev,
          code: value + restOfCode
        }));
      }
    }

    // Clear error for this field if it exists
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Handle checkbox changes
  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));

    // If setting to parent account, clear parentId
    if (name === 'isParent' && checked) {
      setFormData(prev => ({
        ...prev,
        parentId: undefined
      }));
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.code) {
      errors.code = t('accounting.chartOfAccounts.error.codeRequired');
    } else if (!/^\d+$/.test(formData.code)) {
      errors.code = t('accounting.chartOfAccounts.error.codeNumeric');
    } else if (!formData.code.startsWith(formData.scfClass || '')) {
      errors.code = t('accounting.chartOfAccounts.error.codeStartWithClass', { class: formData.scfClass });
    }

    if (!formData.label) {
      errors.label = t('accounting.chartOfAccounts.error.labelRequired');
    }

    if (!formData.isParent && !formData.parentId) {
      errors.parentId = t('accounting.chartOfAccounts.error.parentRequired');
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Save account
  const handleSaveAccount = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      if (selectedAccount) {
        // Update existing account
        await accountingService.updateChartOfAccount(selectedAccount._id || '', formData);
        toast({
          title: t('common.success'),
          description: t('accounting.chartOfAccounts.success.updated'),
        });
      } else {
        // Create new account
        await accountingService.createChartOfAccount(formData);
        toast({
          title: t('common.success'),
          description: t('accounting.chartOfAccounts.success.created'),
        });
      }

      // Refresh accounts and close dialog
      fetchAccounts();
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
          <h1 className="text-3xl font-bold">{t('accounting.chartOfAccounts.title')}</h1>
          <p className="text-sm text-muted-foreground">{t('accounting.chartOfAccounts.scfDescription')}</p>
        </div>
        <Button onClick={handleAddAccount}>
          {t('accounting.chartOfAccounts.addAccount')}
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div className="rounded-md border">
          <ScrollArea className="h-[calc(100vh-220px)]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('accounting.chartOfAccounts.code')}</TableHead>
                  <TableHead>{t('accounting.chartOfAccounts.label')}</TableHead>
                  <TableHead>{t('accounting.chartOfAccounts.type')}</TableHead>
                  <TableHead>{t('accounting.chartOfAccounts.scfClass')}</TableHead>
                  <TableHead>{t('accounting.chartOfAccounts.parent')}</TableHead>
                  <TableHead className="text-right">{t('accounting.chartOfAccounts.balance')}</TableHead>
                  <TableHead className="text-right">{t('common.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {accounts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">
                      {t('common.noData')}
                    </TableCell>
                  </TableRow>
                ) : (
                  accounts.map((account) => (
                    <TableRow key={account._id} className={!account.isActive ? 'opacity-50' : ''}>
                      <TableCell className="font-mono">{account.code}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>{account.label}</span>
                          {account.description && (
                            <span className="text-xs text-muted-foreground">{account.description}</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getAccountTypeColor(account.type)}>
                          {t(`accounting.chartOfAccounts.types.${account.type}`)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getSCFClassColor(account.scfClass)}>
                          {t('accounting.chartOfAccounts.class')} {account.scfClass}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {account.isParent ? (
                          <Badge variant="outline">{t('accounting.chartOfAccounts.isParent')}</Badge>
                        ) : account.parentId ? (
                          accounts.find(a => a._id === account.parentId)?.label || '-'
                        ) : '-'}
                      </TableCell>
                      <TableCell className="text-right font-mono">{formatCurrency(account.balance)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditAccount(account)}
                        >
                          {t('common.edit')}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </div>
      )}

      {/* Account Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {selectedAccount ? t('accounting.chartOfAccounts.editAccount') : t('accounting.chartOfAccounts.addAccount')}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              {/* SCF Class */}
              <div className="space-y-2">
                <Label htmlFor="scfClass">{t('accounting.chartOfAccounts.scfClass')}</Label>
                <Select
                  value={formData.scfClass}
                  onValueChange={(value) => handleSelectChange('scfClass', value)}
                >
                  <SelectTrigger id="scfClass" className={formErrors.scfClass ? 'border-red-500' : ''}>
                    <SelectValue placeholder={t('accounting.chartOfAccounts.selectClass')} />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(SCFClass).map((scfClass) => (
                      <SelectItem key={scfClass} value={scfClass}>
                        {t('accounting.chartOfAccounts.class')} {scfClass} - {t(`accounting.chartOfAccounts.classes.${scfClass}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.scfClass && <p className="text-sm text-red-500">{formErrors.scfClass}</p>}
              </div>

              {/* Account Code */}
              <div className="space-y-2">
                <Label htmlFor="code">{t('accounting.chartOfAccounts.code')}</Label>
                <Input
                  id="code"
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  className={formErrors.code ? 'border-red-500' : ''}
                />
                {formErrors.code ? (
                  <p className="text-sm text-red-500">{formErrors.code}</p>
                ) : (
                  <p className="text-xs text-muted-foreground">{t('accounting.chartOfAccounts.codeHelp')}</p>
                )}
              </div>
            </div>

            {/* Account Label */}
            <div className="space-y-2">
              <Label htmlFor="label">{t('accounting.chartOfAccounts.label')}</Label>
              <Input
                id="label"
                name="label"
                value={formData.label}
                onChange={handleInputChange}
                className={formErrors.label ? 'border-red-500' : ''}
              />
              {formErrors.label && <p className="text-sm text-red-500">{formErrors.label}</p>}
            </div>

            {/* Account Type */}
            <div className="space-y-2">
              <Label htmlFor="type">{t('accounting.chartOfAccounts.type')}</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleSelectChange('type', value)}
              >
                <SelectTrigger id="type" className={formErrors.type ? 'border-red-500' : ''}>
                  <SelectValue placeholder={t('accounting.chartOfAccounts.selectType')} />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(AccountType).map((type) => (
                    <SelectItem key={type} value={type}>
                      {t(`accounting.chartOfAccounts.types.${type}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formErrors.type && <p className="text-sm text-red-500">{formErrors.type}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Is Parent Account */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isParent"
                  checked={formData.isParent}
                  onChange={(e) => handleCheckboxChange('isParent', e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <Label htmlFor="isParent">{t('accounting.chartOfAccounts.isParent')}</Label>
              </div>

              {/* Parent Account (if not a parent) */}
              {!formData.isParent && (
                <div className="space-y-2">
                  <Label htmlFor="parentId">{t('accounting.chartOfAccounts.parentAccount')}</Label>
                  <Select
                    value={formData.parentId}
                    onValueChange={(value) => handleSelectChange('parentId', value)}
                  >
                    <SelectTrigger id="parentId" className={formErrors.parentId ? 'border-red-500' : ''}>
                      <SelectValue placeholder={t('accounting.chartOfAccounts.selectParent')} />
                    </SelectTrigger>
                    <SelectContent>
                      {getParentAccounts().map((parent) => (
                        <SelectItem key={parent._id} value={parent._id || ''}>
                          {parent.code} - {parent.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formErrors.parentId && <p className="text-sm text-red-500">{formErrors.parentId}</p>}
                </div>
              )}
            </div>

            {/* Balance */}
            <div className="space-y-2">
              <Label htmlFor="balance">{t('accounting.chartOfAccounts.balance')} (DZD)</Label>
              <Input
                id="balance"
                name="balance"
                type="number"
                value={formData.balance}
                onChange={handleInputChange}
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">{t('accounting.chartOfAccounts.description')}</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
              />
            </div>

            {/* Is Active */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => handleCheckboxChange('isActive', e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <Label htmlFor="isActive">{t('accounting.chartOfAccounts.isActive')}</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button onClick={handleSaveAccount}>
              {t('common.save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChartOfAccounts;


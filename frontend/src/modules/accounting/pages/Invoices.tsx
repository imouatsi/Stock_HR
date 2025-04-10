import React, { useState, useEffect } from 'react';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';

import { accountingService, Invoice as AccountingInvoice } from '@/services/accountingService';

interface Invoice {
  id: string;
  number: string;
  date: string;
  dueDate: string;
  client: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
}

const Invoices: React.FC = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    number: '',
    client: '',
    amount: 0,
    status: 'pending' as 'pending' | 'paid' | 'overdue',
    date: new Date(),
    dueDate: new Date(new Date().setDate(new Date().getDate() + 30)), // Default due date is 30 days from now
  });

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      setIsLoading(true);
      const data = await accountingService.getAllInvoices();
      setInvoices(data.map(inv => ({
        id: inv._id,
        number: inv.invoiceNumber,
        date: inv.issuedDate,
        dueDate: inv.dueDate,
        client: inv.customer.name,
        amount: inv.total,
        status: inv.status.toLowerCase() as 'paid' | 'pending' | 'overdue'
      })));
    } catch (error) {
      toast({
        title: t('common.error.title'),
        description: t('accounting.invoices.error.loading'),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) || 0 : value
    }));
  };

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle date changes
  const handleDateChange = (name: string, date: Date | undefined) => {
    if (date) {
      setFormData(prev => ({
        ...prev,
        [name]: date
      }));
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      number: '',
      client: '',
      amount: 0,
      status: 'pending',
      date: new Date(),
      dueDate: new Date(new Date().setDate(new Date().getDate() + 30)),
    });
  };

  // Open dialog
  const handleAddInvoice = () => {
    setIsDialogOpen(true);
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);

      // Validate form
      if (!formData.number || !formData.client || formData.amount <= 0) {
        toast({
          title: t('common.error.title'),
          description: t('accounting.invoices.error.requiredFields'),
          variant: 'destructive',
        });
        return;
      }

      // Create invoice
      const newInvoice = await accountingService.createInvoice({
        ...formData,
        date: formData.date.toISOString(),
        dueDate: formData.dueDate.toISOString(),
      });

      // Update invoices list
      setInvoices(prev => [newInvoice, ...prev]);

      // Show success message
      toast({
        title: t('common.success'),
        description: t('accounting.invoices.success.created'),
      });

      // Close dialog and reset form
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error creating invoice:', error);
      toast({
        title: t('common.error.title'),
        description: t('accounting.invoices.error.creating'),
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{t('accounting.invoices.title')}</h1>
        <Button onClick={handleAddInvoice}>
          {t('accounting.invoices.addInvoice')}
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('accounting.invoices.number')}</TableHead>
              <TableHead>{t('accounting.invoices.date')}</TableHead>
              <TableHead>{t('accounting.invoices.dueDate')}</TableHead>
              <TableHead>{t('accounting.invoices.client')}</TableHead>
              <TableHead>{t('accounting.invoices.amount')}</TableHead>
              <TableHead>{t('accounting.invoices.status')}</TableHead>
              <TableHead className="text-right">{t('common.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!invoices || invoices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  {t('common.noData')}
                </TableCell>
              </TableRow>
            ) : (
              invoices?.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell>{invoice?.number}</TableCell>
                  <TableCell>{invoice?.date}</TableCell>
                  <TableCell>{invoice?.dueDate}</TableCell>
                  <TableCell>{invoice?.client}</TableCell>
                  <TableCell>{invoice?.amount?.toFixed(2)} DZD</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        invoice?.status === 'paid'
                          ? 'bg-green-100 text-green-800'
                          : invoice?.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {invoice?.status === 'paid' ? t('accounting.invoices.status.paid') :
                       invoice?.status === 'pending' ? t('accounting.invoices.status.pending') :
                       invoice?.status === 'overdue' ? t('accounting.invoices.status.overdue') : t('accounting.invoices.status.pending')}
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

      {/* Add Invoice Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('accounting.invoices.addInvoice')}</DialogTitle>
            <DialogDescription>
              {t('accounting.invoices.addInvoiceDescription')}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="number">{t('accounting.invoices.number')}</Label>
                <Input
                  id="number"
                  name="number"
                  value={formData.number}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="client">{t('accounting.invoices.client')}</Label>
                <Input
                  id="client"
                  name="client"
                  value={formData.client}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">{t('accounting.invoices.amount')}</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                value={formData.amount}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t('accounting.invoices.date')}</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.date ? format(formData.date, 'PPP') : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.date}
                      onSelect={(date) => handleDateChange('date', date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>{t('accounting.invoices.dueDate')}</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.dueDate ? format(formData.dueDate, 'PPP') : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.dueDate}
                      onSelect={(date) => handleDateChange('dueDate', date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">{t('accounting.invoices.status')}</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleSelectChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('accounting.invoices.selectStatus')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">{t('accounting.invoices.status.pending')}</SelectItem>
                  <SelectItem value="paid">{t('accounting.invoices.status.paid')}</SelectItem>
                  <SelectItem value="overdue">{t('accounting.invoices.status.overdue')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                {t('common.cancel')}
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? t('common.submitting') : t('common.save')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Invoices;
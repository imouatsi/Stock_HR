import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { accountingService } from '@/services/accountingService';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { columns } from './proformaColumns';
import type { ProformaInvoice } from './proformaColumns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

// Define the proforma invoice form schema
const proformaFormSchema = z.object({
  number: z.string().min(1, { message: 'Invoice number is required' }),
  clientName: z.string().min(1, { message: 'Client name is required' }),
  issueDate: z.string().min(1, { message: 'Issue date is required' }),
  dueDate: z.string().min(1, { message: 'Due date is required' }),
  amount: z.coerce.number().min(0, { message: 'Amount must be a positive number' }),
  notes: z.string().optional(),
});

const ProformaInvoices = () => {
  const { toast } = useToast();
  const [proformas, setProformas] = useState<ProformaInvoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProformas();
  }, []);

  const fetchProformas = async () => {
    try {
      setIsLoading(true);
      const data = await accountingService.getAllProformaInvoices();
      setProformas(data.map(inv => ({
        id: inv._id || inv.id,
        invoiceNumber: inv.number || inv.invoiceNumber,
        date: inv.date || inv.issuedDate,
        customer: inv.client || (inv.customer?.name || inv.customer),
        amount: inv.amount || inv.total,
        status: inv.status?.toLowerCase() || inv.status
      })));
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load proforma invoices.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Initialize the form
  const form = useForm<z.infer<typeof proformaFormSchema>>({
    resolver: zodResolver(proformaFormSchema),
    defaultValues: {
      number: '',
      clientName: '',
      issueDate: '',
      dueDate: '',
      amount: 0,
      notes: ''
    }
  });

  const handleCreateProforma = () => {
    setIsCreateModalOpen(true);
  };

  const handleCreateSubmit = async (data: z.infer<typeof proformaFormSchema>) => {
    try {
      setIsLoading(true);
      await accountingService.createProformaInvoice(data);
      toast({
        title: 'Success',
        description: 'Proforma invoice created successfully',
        variant: 'default',
      });
      setIsCreateModalOpen(false);
      fetchProformas();
    } catch (error) {
      console.error('Error creating proforma invoice:', error);
      toast({
        title: 'Error',
        description: 'Failed to create proforma invoice',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Proforma Invoices</h1>
        <Button onClick={handleCreateProforma}>
          Create New Proforma
        </Button>
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={proformas}
          searchKey="invoiceNumber"
        />
      )}

      {/* Proforma Invoice Creation Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Proforma Invoice</DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleCreateSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Invoice Number</FormLabel>
                    <FormControl>
                      <Input placeholder="PRO-2023-001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="clientName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Client name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="issueDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Issue Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Due Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount (DZD)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Additional notes"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Create Proforma
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProformaInvoices;
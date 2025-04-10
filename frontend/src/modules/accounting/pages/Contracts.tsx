import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/components/ui/use-toast';
import { accountingService } from '@/services/accountingService';
import { Button } from '../../../components/ui/button';
import { DataTable } from '../../../components/ui/data-table';
import { columns } from './contractColumns';
import type { Contract } from './contractColumns';

export const Contracts = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchContracts();
  }, []);

  const fetchContracts = async () => {
    try {
      setIsLoading(true);
      const data = await accountingService.getAllContracts();
      setContracts(data.map(contract => ({
        id: contract._id || contract.id,
        contractNumber: contract.number || contract.contractNumber,
        startDate: contract.startDate,
        endDate: contract.endDate,
        client: contract.client,
        value: contract.value,
        status: contract.status?.toLowerCase() || contract.status
      })));
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load contracts.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateContract = () => {
    toast({
      title: 'Not Implemented',
      description: 'This feature is coming soon.',
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Contracts</h1>
        <Button onClick={handleCreateContract}>
          Create New Contract
        </Button>
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={contracts}
          searchKey="contractNumber"
        />
      )}
    </div>
  );
};
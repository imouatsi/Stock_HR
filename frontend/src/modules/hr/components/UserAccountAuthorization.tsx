import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { DataTable } from '@/components/ui/data-table';
import { userService } from '@/services/user.service';
import { UserAccount } from '@/types/core.types';
import { formatDate } from '@/utils/format';
import { authService } from '@/services/auth.service';

interface UserAccountAuthorizationProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const UserAccountAuthorization: React.FC<UserAccountAuthorizationProps> = ({
  open,
  onOpenChange,
}) => {
  const [userAccounts, setUserAccounts] = useState<UserAccount[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const columns = [
    {
      accessorKey: 'username',
      header: 'Username',
    },
    {
      accessorKey: 'role',
      header: 'Role',
      cell: ({ row }) => {
        const role = row.getValue('role');
        return (
          <span className="capitalize">
            {role === 'HR' ? 'HR Personnel' :
             role === 'ACC' ? 'Accountant' :
             role === 'MGR' ? 'Manager' :
             role === 'STK' ? 'Stock Clerk' :
             role === 'SLR' ? 'Seller' : role}
          </span>
        );
      },
    },
    {
      accessorKey: 'isAuthorized',
      header: 'Status',
      cell: ({ row }) => {
        const isAuthorized = row.getValue('isAuthorized');
        return (
          <span className={isAuthorized ? 'text-green-600' : 'text-yellow-600'}>
            {isAuthorized ? 'Authorized' : 'Pending Authorization'}
          </span>
        );
      },
    },
    {
      accessorKey: 'createdAt',
      header: 'Created At',
      cell: ({ row }) => formatDate(row.getValue('createdAt')),
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const userAccount = row.original;
        const currentUser = authService.getCurrentUser();

        if (userAccount.isAuthorized) return null;

        return (
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleAuthorize(userAccount.id)}
            disabled={!currentUser || currentUser.role !== 'UA'}
          >
            Authorize
          </Button>
        );
      },
    },
  ];

  const loadUserAccounts = async () => {
    try {
      setLoading(true);
      const response = await userService.getPendingUserAccounts();
      setUserAccounts(response.data || []);
    } catch (err) {
      setError('Failed to load user accounts');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAuthorize = async (userId: string) => {
    try {
      setLoading(true);
      const currentUser = authService.getCurrentUser();
      if (!currentUser) throw new Error('Not authenticated');

      await userService.authorizeUserAccount(userId, currentUser.username);
      await loadUserAccounts();
    } catch (err) {
      setError('Failed to authorize user account');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (open) {
      loadUserAccounts();
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>User Account Authorization</DialogTitle>
          <DialogDescription>
            Review and authorize pending user accounts
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}

        <DataTable
          columns={columns}
          data={userAccounts}
          loading={loading}
        />
      </DialogContent>
    </Dialog>
  );
}; 
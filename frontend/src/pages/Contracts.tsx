import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import contractService, { ContractTemplate } from '../services/contractService';

const Contracts: React.FC = () => {
  const { t } = useTranslation();

  const handleGenerateContract = async () => {
    try {
      const contract: ContractTemplate = {
        title: 'Sample Contract',
        description: 'This is a sample contract.',
        startDate: '2023-01-01',
        endDate: '2023-12-31',
        party: {
          name: 'John Doe',
          type: 'individual', // Ensure this matches the expected type
          contact: 'john.doe@example.com',
          address: '123 Main St',
        },
      };
      const pdfBlob = await contractService.generateContract(contract);
      const url = window.URL.createObjectURL(new Blob([pdfBlob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'contract.pdf');
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (error) {
      console.error('Error generating contract:', error);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1">
        {t('contracts.title')}
      </Typography>
      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 2 }}
        onClick={handleGenerateContract}
      >
        Generate Contract
      </Button>
      <Typography variant="body1" sx={{ mt: 2 }}>
        {t('common.noData')}
      </Typography>
    </Box>
  );
};

export default Contracts;
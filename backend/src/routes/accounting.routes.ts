import { Router } from 'express';
import { isAuthenticated } from '../middleware/auth';
import { financialStatementController } from '../controllers/financial-statement.controller';

const router = Router();

// Apply authentication middleware to all accounting routes
router.use(isAuthenticated);

// Invoices endpoints
router.get('/invoices', (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      invoices: []
    }
  });
});

router.get('/invoices/:id', (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      invoice: {
        _id: req.params.id,
        invoiceNumber: 'INV-001',
        client: 'ACME Corp',
        issueDate: '2023-04-01',
        dueDate: '2023-05-01',
        amount: 1500,
        currency: 'DZD',
        status: 'pending'
      }
    }
  });
});

// Contracts endpoints
router.get('/contracts', (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      contracts: []
    }
  });
});

router.get('/contracts/:id', (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      contract: {
        _id: req.params.id,
        contractNumber: 'CON-001',
        client: 'ACME Corp',
        startDate: '2023-01-01',
        endDate: '2023-12-31',
        value: 18000,
        currency: 'DZD',
        status: 'active'
      }
    }
  });
});

// Proforma invoices endpoints
router.get('/proforma-invoices', (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      proformaInvoices: []
    }
  });
});

router.get('/proforma-invoices/:id', (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      proformaInvoice: {
        _id: req.params.id,
        invoiceNumber: 'PRO-001',
        client: 'ACME Corp',
        issueDate: '2023-03-15',
        validUntil: '2023-04-15',
        amount: 1500,
        currency: 'DZD',
        status: 'pending'
      }
    }
  });
});

// Journal entries endpoints
router.get('/journal-entries', (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      journalEntries: []
    }
  });
});

router.get('/journal-entries/:id', (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      journalEntry: {
        _id: req.params.id,
        date: '2023-04-01',
        description: 'Monthly expense entry',
        debitAccount: 'Expenses',
        creditAccount: 'Cash',
        amount: 1000,
        currency: 'DZD'
      }
    }
  });
});

// Chart of accounts endpoints
router.get('/chart-of-accounts', (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      accounts: []
    }
  });
});

router.get('/chart-of-accounts/:id', (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      account: {
        _id: req.params.id,
        code: '1000',
        name: 'Cash',
        type: 'Asset',
        balance: 5000,
        currency: 'DZD'
      }
    }
  });
});

// Financial statements endpoints
router.get('/financial-statements', financialStatementController.getAllFinancialStatements);
router.get('/financial-statements/:id', financialStatementController.getFinancialStatement);
router.post('/financial-statements', financialStatementController.createFinancialStatement);
router.post('/financial-statements/generate', financialStatementController.generateFinancialStatement);
router.post('/financial-statements/:id/finalize', financialStatementController.finalizeFinancialStatement);
router.get('/financial-statements/:id/export/pdf', financialStatementController.exportFinancialStatementToPDF);
router.get('/financial-statements/:id/export/excel', financialStatementController.exportFinancialStatementToExcel);

export default router;

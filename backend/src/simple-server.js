const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Logger middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Sample data
const sampleData = {
  inventory: Array.from({ length: 10 }, (_, i) => ({
    _id: `inv${i + 1}`,
    name: `Item ${i + 1}`,
    description: `Description for Item ${i + 1}`,
    category: `Category ${(i % 3) + 1}`,
    quantity: Math.floor(Math.random() * 100),
    price: Math.floor(Math.random() * 1000) + 100,
    supplier: `Supplier ${(i % 5) + 1}`,
    lastUpdated: new Date().toISOString()
  })),
  categories: Array.from({ length: 5 }, (_, i) => ({
    _id: `cat${i + 1}`,
    name: `Category ${i + 1}`,
    description: `Description for Category ${i + 1}`
  })),
  suppliers: Array.from({ length: 5 }, (_, i) => ({
    _id: `sup${i + 1}`,
    name: `Supplier ${i + 1}`,
    contactPerson: `Contact Person ${i + 1}`,
    email: `supplier${i + 1}@example.com`,
    phone: `123-456-${7890 + i}`,
    address: `${i + 1} Supplier St, City, Country`
  })),
  movements: Array.from({ length: 10 }, (_, i) => ({
    _id: `mov${i + 1}`,
    type: i % 2 === 0 ? 'in' : 'out',
    quantity: Math.floor(Math.random() * 20) + 1,
    inventoryItem: `Item ${(i % 10) + 1}`,
    reference: `REF-00${i + 1}`,
    notes: `${i % 2 === 0 ? 'Restocking' : 'Customer order'}`,
    status: 'completed',
    user: 'John Doe',
    timestamp: new Date().toISOString()
  })),
  purchaseOrders: Array.from({ length: 5 }, (_, i) => ({
    _id: `po${i + 1}`,
    reference: `PO-00${i + 1}`,
    supplier: `Supplier ${(i % 5) + 1}`,
    items: [
      {
        inventoryItem: `Item ${(i % 10) + 1}`,
        quantity: Math.floor(Math.random() * 20) + 1,
        unitPrice: Math.floor(Math.random() * 100) + 50
      }
    ],
    status: i % 3 === 0 ? 'pending' : i % 3 === 1 ? 'approved' : 'delivered',
    expectedDeliveryDate: new Date(Date.now() + (i + 1) * 86400000).toISOString(),
    notes: i % 2 === 0 ? 'Urgent order' : 'Regular order'
  })),
  employees: Array.from({ length: 10 }, (_, i) => ({
    _id: `emp${i + 1}`,
    firstName: `First${i + 1}`,
    lastName: `Last${i + 1}`,
    email: `employee${i + 1}@example.com`,
    phone: `123-456-${7890 + i}`,
    department: `Department ${(i % 3) + 1}`,
    position: `Position ${(i % 5) + 1}`,
    hireDate: new Date(Date.now() - (i + 1) * 86400000 * 30).toISOString(),
    salary: 30000 + i * 5000,
    status: 'active'
  })),
  departments: Array.from({ length: 3 }, (_, i) => ({
    _id: `dep${i + 1}`,
    name: `Department ${i + 1}`,
    description: `Description for Department ${i + 1}`,
    manager: `First${i + 1} Last${i + 1}`
  })),
  positions: Array.from({ length: 5 }, (_, i) => ({
    _id: `pos${i + 1}`,
    title: `Position ${i + 1}`,
    department: `Department ${(i % 3) + 1}`,
    responsibilities: `Responsibilities for Position ${i + 1}`
  })),
  leaveRequests: Array.from({ length: 5 }, (_, i) => ({
    _id: `leave${i + 1}`,
    employee: `First${i + 1} Last${i + 1}`,
    startDate: new Date(Date.now() + (i + 1) * 86400000 * 7).toISOString(),
    endDate: new Date(Date.now() + (i + 1) * 86400000 * 7 + 86400000 * 5).toISOString(),
    reason: i % 2 === 0 ? 'Vacation' : 'Sick leave',
    status: i % 3 === 0 ? 'pending' : i % 3 === 1 ? 'approved' : 'rejected'
  })),
  performanceReviews: Array.from({ length: 5 }, (_, i) => ({
    _id: `review${i + 1}`,
    employee: `First${i + 1} Last${i + 1}`,
    reviewer: `First${(i + 2) % 10 + 1} Last${(i + 2) % 10 + 1}`,
    date: new Date(Date.now() - (i + 1) * 86400000 * 30).toISOString(),
    rating: (Math.floor(Math.random() * 10) + 1) / 2,
    comments: `Performance review comments for employee ${i + 1}`
  })),
  invoices: Array.from({ length: 10 }, (_, i) => ({
    _id: `inv${i + 1}`,
    invoiceNumber: `INV-00${i + 1}`,
    client: `Client ${(i % 5) + 1}`,
    issueDate: new Date(Date.now() - (i + 1) * 86400000 * 5).toISOString(),
    dueDate: new Date(Date.now() + (i + 1) * 86400000 * 25).toISOString(),
    amount: Math.floor(Math.random() * 10000) + 1000,
    currency: 'DZD',
    status: i % 3 === 0 ? 'pending' : i % 3 === 1 ? 'paid' : 'overdue'
  })),
  contracts: Array.from({ length: 5 }, (_, i) => ({
    _id: `con${i + 1}`,
    contractNumber: `CON-00${i + 1}`,
    client: `Client ${(i % 5) + 1}`,
    startDate: new Date(Date.now() - (i + 1) * 86400000 * 30).toISOString(),
    endDate: new Date(Date.now() + (i + 1) * 86400000 * 365).toISOString(),
    value: Math.floor(Math.random() * 100000) + 10000,
    currency: 'DZD',
    status: i % 2 === 0 ? 'active' : 'completed'
  })),
  proformaInvoices: Array.from({ length: 5 }, (_, i) => ({
    _id: `pro${i + 1}`,
    invoiceNumber: `PRO-00${i + 1}`,
    client: `Client ${(i % 5) + 1}`,
    issueDate: new Date(Date.now() - (i + 1) * 86400000 * 2).toISOString(),
    validUntil: new Date(Date.now() + (i + 1) * 86400000 * 28).toISOString(),
    amount: Math.floor(Math.random() * 10000) + 1000,
    currency: 'DZD',
    status: i % 2 === 0 ? 'pending' : 'accepted'
  })),
  journalEntries: Array.from({ length: 10 }, (_, i) => ({
    _id: `journal${i + 1}`,
    date: new Date(Date.now() - (i + 1) * 86400000 * 5).toISOString(),
    description: `Journal entry ${i + 1}`,
    debitAccount: `Account ${(i % 5) + 1}`,
    creditAccount: `Account ${((i + 2) % 5) + 1}`,
    amount: Math.floor(Math.random() * 10000) + 1000,
    currency: 'DZD'
  })),
  chartOfAccounts: Array.from({ length: 10 }, (_, i) => ({
    _id: `account${i + 1}`,
    code: `${1000 + i * 100}`,
    name: `Account ${i + 1}`,
    type: i % 4 === 0 ? 'Asset' : i % 4 === 1 ? 'Liability' : i % 4 === 2 ? 'Equity' : 'Revenue',
    balance: Math.floor(Math.random() * 100000) + 10000,
    currency: 'DZD'
  }))
};

// API Routes

// Stock routes
app.get('/api/stock/inventory', (req, res) => {
  res.json({ status: 'success', data: { inventory: sampleData.inventory } });
});

app.get('/api/stock/categories', (req, res) => {
  res.json({ status: 'success', data: { categories: sampleData.categories } });
});

app.get('/api/suppliers', (req, res) => {
  res.json({ status: 'success', data: { suppliers: sampleData.suppliers } });
});

app.get('/api/movements', (req, res) => {
  res.json({ status: 'success', data: { movements: sampleData.movements } });
});

app.get('/api/stock/purchase-orders', (req, res) => {
  res.json({ status: 'success', data: { purchaseOrders: sampleData.purchaseOrders } });
});

// HR routes
app.get('/api/hr/employees', (req, res) => {
  res.json({ status: 'success', data: { employees: sampleData.employees } });
});

app.get('/api/hr/departments', (req, res) => {
  res.json({ status: 'success', data: { departments: sampleData.departments } });
});

app.get('/api/hr/positions', (req, res) => {
  res.json({ status: 'success', data: { positions: sampleData.positions } });
});

app.get('/api/hr/leave-requests', (req, res) => {
  res.json({ status: 'success', data: { leaveRequests: sampleData.leaveRequests } });
});

app.get('/api/hr/performance-reviews', (req, res) => {
  res.json({ status: 'success', data: { performanceReviews: sampleData.performanceReviews } });
});

// Accounting routes
app.get('/api/accounting/invoices', (req, res) => {
  res.json({ status: 'success', data: { invoices: sampleData.invoices } });
});

app.get('/api/accounting/contracts', (req, res) => {
  res.json({ status: 'success', data: { contracts: sampleData.contracts } });
});

app.get('/api/accounting/proforma-invoices', (req, res) => {
  res.json({ status: 'success', data: { proformaInvoices: sampleData.proformaInvoices } });
});

app.get('/api/accounting/journal-entries', (req, res) => {
  res.json({ status: 'success', data: { journalEntries: sampleData.journalEntries } });
});

app.get('/api/accounting/chart-of-accounts', (req, res) => {
  res.json({ status: 'success', data: { accounts: sampleData.chartOfAccounts } });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'success', message: 'Server is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Simple server running on port ${PORT}`);
  console.log(`MongoDB connection: Mocked with sample data`);
});

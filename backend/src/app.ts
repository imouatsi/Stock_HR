/// <reference path="../global.d.ts" />
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import backupRoutes from './routes/backupRoutes';
import authRoutes from './routes/auth.routes';
import stockRoutes from './routes/stock.routes';
import inventoryRoutes from './routes/inventory.routes';
import invoiceRoutes from './routes/invoice.routes';
import contractRoutes from './routes/contract.routes';
import hrRoutes from './routes/hr.routes';
import accountingRoutes from './routes/accounting.routes';
import suppliersRoutes from './routes/suppliers.routes';
import movementsRoutes from './routes/movements.routes';
import purchaseOrdersRoutes from './routes/purchase-orders.routes';
import categoriesRoutes from './routes/categories.routes';

// New Stock Module Routes
import productRoutes from './routes/product.routes';
import warehouseRoutes from './routes/warehouse.routes';
import categoryRoutes from './routes/category.routes';
import supplierRoutes from './routes/supplier.routes';
import stockItemRoutes from './routes/stock-item.routes';

import { errorHandler } from './middleware/error.middleware';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the views directory
app.use(express.static(path.join(__dirname, 'views')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/backup', backupRoutes);
app.use('/api/stock/purchase-orders', purchaseOrdersRoutes);
app.use('/api/stock/categories', categoriesRoutes);
app.use('/api/stock', stockRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/contracts', contractRoutes);
app.use('/api/hr', hrRoutes);
app.use('/api/accounting', accountingRoutes);
app.use('/api/suppliers', suppliersRoutes);
app.use('/api/movements', movementsRoutes);

// New Stock Module API Routes
app.use('/api/v2/products', productRoutes);
app.use('/api/v2/warehouses', warehouseRoutes);
app.use('/api/v2/categories', categoryRoutes);
app.use('/api/v2/suppliers', supplierRoutes);
app.use('/api/v2/stock-items', stockItemRoutes);

// Serve backup interface
app.get('/backup', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'backup.html'));
});

// Error handler middleware
app.use(errorHandler);

export default app;
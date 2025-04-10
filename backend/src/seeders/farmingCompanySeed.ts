import mongoose from 'mongoose';
import { config } from '../config';
import { StockItem } from '../models/stock.model';
import User from '../models/user.model';

// Seed data for a farming company
const seedFarmingCompanyData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.mongoUri);
    console.log('Connected to MongoDB for farming company seed');

    // Check if superadmin exists, if not create one
    const existingSuperAdmin = await User.findOne({ username: 'superadmin' });
    if (!existingSuperAdmin) {
      await User.create({
        username: 'superadmin',
        password: 'Admin@123',
        role: 'superadmin',
        isAuthorized: true,
        isActive: true
      });
      console.log('Superadmin created successfully');
    }

    // Get the superadmin ID for reference
    const superadmin = await User.findOne({ username: 'superadmin' });
    if (!superadmin) {
      throw new Error('Superadmin not found');
    }

    // Clear existing stock items
    await StockItem.deleteMany({});
    console.log('Cleared existing stock items');

    // Define categories
    const categories = [
      'Seeds',
      'Fertilizers',
      'Pesticides',
      'Equipment',
      'Tools',
      'Irrigation',
      'Harvesting',
      'Storage',
      'Packaging'
    ];

    // Define suppliers
    const suppliers = [
      'AgriSeed Solutions',
      'FarmTech Equipment',
      'GreenGrow Fertilizers',
      'Harvest Pro Tools',
      'IrriTech Systems',
      'Organic Farming Supplies',
      'PestGuard Solutions',
      'SoilCare Products',
      'StorageMax Systems',
      'EcoFarm Packaging'
    ];

    // Create stock items for seeds
    const seedItems = [
      {
        name: 'Wheat Seeds (Premium)',
        description: 'High-yield wheat seeds suitable for semi-arid conditions',
        quantity: 2500,
        unitPrice: 45.50,
        category: 'Seeds',
        supplier: 'AgriSeed Solutions',
        reorderPoint: 500,
        location: 'Warehouse A',
        lastRestocked: new Date('2025-03-15'),
        createdBy: superadmin._id,
        updatedBy: superadmin._id
      },
      {
        name: 'Barley Seeds',
        description: 'Drought-resistant barley variety',
        quantity: 1800,
        unitPrice: 38.75,
        category: 'Seeds',
        supplier: 'AgriSeed Solutions',
        reorderPoint: 400,
        location: 'Warehouse A',
        lastRestocked: new Date('2025-03-10'),
        createdBy: superadmin._id,
        updatedBy: superadmin._id
      },
      {
        name: 'Corn Seeds (Hybrid)',
        description: 'High-yield hybrid corn seeds',
        quantity: 3200,
        unitPrice: 52.25,
        category: 'Seeds',
        supplier: 'Organic Farming Supplies',
        reorderPoint: 600,
        location: 'Warehouse B',
        lastRestocked: new Date('2025-03-20'),
        createdBy: superadmin._id,
        updatedBy: superadmin._id
      },
      {
        name: 'Alfalfa Seeds',
        description: 'Premium alfalfa seeds for fodder production',
        quantity: 1200,
        unitPrice: 65.00,
        category: 'Seeds',
        supplier: 'AgriSeed Solutions',
        reorderPoint: 300,
        location: 'Warehouse A',
        lastRestocked: new Date('2025-03-05'),
        createdBy: superadmin._id,
        updatedBy: superadmin._id
      },
      {
        name: 'Tomato Seeds (Greenhouse)',
        description: 'Greenhouse variety tomato seeds',
        quantity: 850,
        unitPrice: 78.50,
        category: 'Seeds',
        supplier: 'Organic Farming Supplies',
        reorderPoint: 200,
        location: 'Warehouse B',
        lastRestocked: new Date('2025-03-12'),
        createdBy: superadmin._id,
        updatedBy: superadmin._id
      }
    ];

    // Create stock items for fertilizers
    const fertilizerItems = [
      {
        name: 'NPK Fertilizer (20-10-10)',
        description: 'Balanced NPK fertilizer for general crop use',
        quantity: 5000,
        unitPrice: 32.75,
        category: 'Fertilizers',
        supplier: 'GreenGrow Fertilizers',
        reorderPoint: 1000,
        location: 'Warehouse C',
        lastRestocked: new Date('2025-03-18'),
        createdBy: superadmin._id,
        updatedBy: superadmin._id
      },
      {
        name: 'Organic Compost',
        description: 'Premium organic compost for organic farming',
        quantity: 8000,
        unitPrice: 18.50,
        category: 'Fertilizers',
        supplier: 'Organic Farming Supplies',
        reorderPoint: 1500,
        location: 'Warehouse C',
        lastRestocked: new Date('2025-03-22'),
        createdBy: superadmin._id,
        updatedBy: superadmin._id
      },
      {
        name: 'Phosphate Fertilizer',
        description: 'High-phosphate fertilizer for root development',
        quantity: 3500,
        unitPrice: 28.25,
        category: 'Fertilizers',
        supplier: 'GreenGrow Fertilizers',
        reorderPoint: 800,
        location: 'Warehouse C',
        lastRestocked: new Date('2025-03-14'),
        createdBy: superadmin._id,
        updatedBy: superadmin._id
      },
      {
        name: 'Nitrogen Booster',
        description: 'Concentrated nitrogen supplement for leafy crops',
        quantity: 2800,
        unitPrice: 42.00,
        category: 'Fertilizers',
        supplier: 'SoilCare Products',
        reorderPoint: 600,
        location: 'Warehouse C',
        lastRestocked: new Date('2025-03-16'),
        createdBy: superadmin._id,
        updatedBy: superadmin._id
      }
    ];

    // Create stock items for pesticides
    const pesticideItems = [
      {
        name: 'Organic Insecticide',
        description: 'Natural insecticide safe for organic farming',
        quantity: 1200,
        unitPrice: 85.50,
        category: 'Pesticides',
        supplier: 'PestGuard Solutions',
        reorderPoint: 300,
        location: 'Warehouse D',
        lastRestocked: new Date('2025-03-08'),
        createdBy: superadmin._id,
        updatedBy: superadmin._id
      },
      {
        name: 'Fungicide (Broad Spectrum)',
        description: 'Effective against common crop fungal diseases',
        quantity: 950,
        unitPrice: 92.75,
        category: 'Pesticides',
        supplier: 'PestGuard Solutions',
        reorderPoint: 250,
        location: 'Warehouse D',
        lastRestocked: new Date('2025-03-11'),
        createdBy: superadmin._id,
        updatedBy: superadmin._id
      },
      {
        name: 'Weed Control Solution',
        description: 'Selective herbicide for crop fields',
        quantity: 1500,
        unitPrice: 68.25,
        category: 'Pesticides',
        supplier: 'SoilCare Products',
        reorderPoint: 350,
        location: 'Warehouse D',
        lastRestocked: new Date('2025-03-19'),
        createdBy: superadmin._id,
        updatedBy: superadmin._id
      }
    ];

    // Create stock items for equipment
    const equipmentItems = [
      {
        name: 'Tractor (Medium)',
        description: '75HP farm tractor with attachments',
        quantity: 5,
        unitPrice: 45000.00,
        category: 'Equipment',
        supplier: 'FarmTech Equipment',
        reorderPoint: 1,
        location: 'Equipment Shed A',
        lastRestocked: new Date('2025-02-15'),
        createdBy: superadmin._id,
        updatedBy: superadmin._id
      },
      {
        name: 'Seeder Machine',
        description: 'Precision seeder for row crops',
        quantity: 3,
        unitPrice: 12500.00,
        category: 'Equipment',
        supplier: 'FarmTech Equipment',
        reorderPoint: 1,
        location: 'Equipment Shed A',
        lastRestocked: new Date('2025-02-20'),
        createdBy: superadmin._id,
        updatedBy: superadmin._id
      },
      {
        name: 'Irrigation Pump',
        description: 'High-capacity water pump for irrigation',
        quantity: 8,
        unitPrice: 3200.00,
        category: 'Irrigation',
        supplier: 'IrriTech Systems',
        reorderPoint: 2,
        location: 'Equipment Shed B',
        lastRestocked: new Date('2025-03-01'),
        createdBy: superadmin._id,
        updatedBy: superadmin._id
      },
      {
        name: 'Harvester (Grain)',
        description: 'Combine harvester for grain crops',
        quantity: 2,
        unitPrice: 85000.00,
        category: 'Harvesting',
        supplier: 'FarmTech Equipment',
        reorderPoint: 1,
        location: 'Equipment Shed A',
        lastRestocked: new Date('2025-01-25'),
        createdBy: superadmin._id,
        updatedBy: superadmin._id
      }
    ];

    // Create stock items for tools
    const toolItems = [
      {
        name: 'Hand Pruners',
        description: 'Professional-grade hand pruners for orchard maintenance',
        quantity: 45,
        unitPrice: 28.50,
        category: 'Tools',
        supplier: 'Harvest Pro Tools',
        reorderPoint: 10,
        location: 'Tool Shed',
        lastRestocked: new Date('2025-03-05'),
        createdBy: superadmin._id,
        updatedBy: superadmin._id
      },
      {
        name: 'Soil Testing Kit',
        description: 'Comprehensive soil analysis kit',
        quantity: 15,
        unitPrice: 125.00,
        category: 'Tools',
        supplier: 'SoilCare Products',
        reorderPoint: 5,
        location: 'Lab Storage',
        lastRestocked: new Date('2025-03-10'),
        createdBy: superadmin._id,
        updatedBy: superadmin._id
      },
      {
        name: 'Irrigation Drip Tape',
        description: 'Water-efficient drip irrigation tape (1000m roll)',
        quantity: 25,
        unitPrice: 85.75,
        category: 'Irrigation',
        supplier: 'IrriTech Systems',
        reorderPoint: 8,
        location: 'Warehouse B',
        lastRestocked: new Date('2025-03-15'),
        createdBy: superadmin._id,
        updatedBy: superadmin._id
      }
    ];

    // Create stock items for storage and packaging
    const storageItems = [
      {
        name: 'Grain Storage Bags',
        description: 'Heavy-duty grain storage bags (100 pack)',
        quantity: 120,
        unitPrice: 45.00,
        category: 'Storage',
        supplier: 'StorageMax Systems',
        reorderPoint: 30,
        location: 'Warehouse E',
        lastRestocked: new Date('2025-03-12'),
        createdBy: superadmin._id,
        updatedBy: superadmin._id
      },
      {
        name: 'Produce Crates',
        description: 'Stackable plastic crates for produce (10 pack)',
        quantity: 200,
        unitPrice: 65.50,
        category: 'Storage',
        supplier: 'StorageMax Systems',
        reorderPoint: 50,
        location: 'Warehouse E',
        lastRestocked: new Date('2025-03-18'),
        createdBy: superadmin._id,
        updatedBy: superadmin._id
      },
      {
        name: 'Eco-Friendly Packaging',
        description: 'Biodegradable packaging for farm products (500 units)',
        quantity: 85,
        unitPrice: 120.25,
        category: 'Packaging',
        supplier: 'EcoFarm Packaging',
        reorderPoint: 20,
        location: 'Warehouse E',
        lastRestocked: new Date('2025-03-20'),
        createdBy: superadmin._id,
        updatedBy: superadmin._id
      }
    ];

    // Combine all items
    const allItems = [
      ...seedItems,
      ...fertilizerItems,
      ...pesticideItems,
      ...equipmentItems,
      ...toolItems,
      ...storageItems
    ];

    // Insert all stock items
    await StockItem.insertMany(allItems);
    console.log(`Successfully seeded ${allItems.length} stock items`);

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');

  } catch (error) {
    console.error('Error seeding farming company data:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

// Run the seed function
seedFarmingCompanyData();

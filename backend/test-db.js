import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const testConnection = async () => {
  try {
    console.log('Testing connection to:', process.env.MONGODB_URI);
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB!');
    
    // List all databases
    const admin = mongoose.connection.db.admin();
    const databases = await admin.listDatabases();
    console.log('📁 Available databases:');
    databases.databases.forEach(db => {
      console.log(`  - ${db.name}`);
    });
    
    // Check our specific database
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log(`\n📋 Collections in 'cmrit-makerspace':`);
    if (collections.length === 0) {
      console.log('  ❌ No collections found - seed may have failed');
    } else {
      collections.forEach(collection => {
        console.log(`  - ${collection.name}`);
      });
    }
    
    // Check if our data exists
    const User = require('./models/User.js');
    const Event = require('./models/Event.js');
    const Inventory = require('./models/Inventory.js');
    
    const userCount = await User.countDocuments();
    const eventCount = await Event.countDocuments();
    const inventoryCount = await Inventory.countDocuments();
    
    console.log('\n📊 Data counts:');
    console.log(`  Users: ${userCount}`);
    console.log(`  Events: ${eventCount}`);
    console.log(`  Inventory items: ${inventoryCount}`);
    
    if (userCount > 0 || eventCount > 0 || inventoryCount > 0) {
      console.log('\n✅ Your data was seeded successfully!');
      console.log('👀 In MongoDB Compass, look for database: "cmrit-makerspace"');
    } else {
      console.log('\n❌ No data found - seeding may have failed');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    process.exit(1);
  }
};

testConnection();

import mongoose from 'mongoose';
import dns from 'dns';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';
import User from '../models/User.js';
import Event from '../models/Event.js';
import Inventory from '../models/Inventory.js';

dotenv.config();
dns.setServers(['8.8.8.8', '1.1.1.1']);

const seedDatabase = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Event.deleteMany({});
    await Inventory.deleteMany({});

    console.log('Database cleared');

    // Create admin user
    const hashedPassword = await bcrypt.hash('cmrit@maker2024', 10);
    
    const adminUser = new User({
      name: 'Administrator',
      email: 'admin@cmrit.ac.in',
      password: hashedPassword,
      role: 'admin'
    });
    await adminUser.save();
    console.log('Admin user created');

    // Seed events
    const events = [
      {
        title: 'ICNI Conference 2026',
        description: 'Networking + poster sessions',
        date: 'Aug 18 2026',
        time: '09:00 AM - 06:00 PM',
        venue: 'Main Auditorium'
      },
      {
        title: 'Hackathon: Build the Future',
        description: '24-hour maker challenge',
        date: 'Sep 5 2026',
        time: '10:00 AM - 10:00 AM',
        venue: 'Makerspace Lab'
      },
      {
        title: 'IoT Workshop Series',
        description: 'Hands-on with sensors & microcontrollers',
        date: 'Oct 12 2026',
        time: '02:00 PM - 05:00 PM',
        venue: 'Electronics Lab'
      }
    ];

    await Event.insertMany(events);
    console.log('Events seeded');

    // Seed inventory
    const inventory = [
      {
        name: 'Creality Ender 3 - 3D Printer',
        description: 'FDM 3D printer for PLA/ABS prototyping',
        fee: 150,
        cmritFee: 50,
        quantity: 3,
        available: 3,
        category: '3d-printing'
      },
      {
        name: 'Prusa i3 MK3S+',
        description: 'High-precision FDM 3D printer',
        fee: 200,
        cmritFee: 75,
        quantity: 2,
        available: 2,
        category: '3d-printing'
      },
      {
        name: 'Laser Cutter - 60W CO2',
        description: 'For cutting wood, acrylic, and engraving',
        fee: 250,
        cmritFee: 100,
        quantity: 1,
        available: 1,
        category: 'laser-cutting'
      },
      {
        name: 'CNC Milling Machine',
        description: '3-axis CNC for precision machining',
        fee: 300,
        cmritFee: 120,
        quantity: 1,
        available: 1,
        category: 'cnc'
      },
      {
        name: 'Soldering Station',
        description: 'Temperature-controlled soldering for PCB work',
        fee: 50,
        cmritFee: 20,
        quantity: 5,
        available: 5,
        category: 'electronics'
      },
      {
        name: 'Digital Oscilloscope',
        description: '4-channel oscilloscope for signal analysis',
        fee: 100,
        cmritFee: 40,
        quantity: 3,
        available: 3,
        category: 'electronics'
      },
      {
        name: 'Resin 3D Printer',
        description: 'High-detail SLA printer for fine prototypes',
        fee: 200,
        cmritFee: 80,
        quantity: 2,
        available: 2,
        category: '3d-printing'
      },
      {
        name: 'Arduino Starter Kit',
        description: 'Microcontroller kit with sensors & modules',
        fee: 30,
        cmritFee: 10,
        quantity: 10,
        available: 10,
        category: 'electronics'
      }
    ];

    await Inventory.insertMany(inventory);
    console.log('Inventory seeded');

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

// Run if called directly
const currentFile = fileURLToPath(import.meta.url);
if (process.argv[1] === currentFile) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
      console.log('Connected to MongoDB');
      seedDatabase();
    })
    .catch((error) => {
      console.error('Database connection error:', error);
      process.exit(1);
    });
}

export default seedDatabase;

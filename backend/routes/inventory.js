import express from 'express';
import { body, validationResult } from 'express-validator';
import Inventory from '../models/Inventory.js';
import { authenticateToken, optionalAuthenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all inventory items
router.get('/', async (req, res) => {
  try {
    const inventory = await Inventory.find().sort({ category: 1, name: 1 });
    res.json({ inventory });
  } catch (error) {
    console.error('Get inventory error:', error);
    res.status(500).json({ message: 'Failed to fetch inventory' });
  }
});

// Get inventory by category
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const inventory = await Inventory.find({ category }).sort({ name: 1 });
    res.json({ inventory });
  } catch (error) {
    console.error('Get inventory by category error:', error);
    res.status(500).json({ message: 'Failed to fetch inventory' });
  }
});

// Add new inventory item (admin only)
router.post('/', authenticateToken, [
  body('name').notEmpty().withMessage('Name is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('fee').isNumeric().withMessage('Fee must be a number'),
  body('cmritFee').isNumeric().withMessage('CMRIT fee must be a number'),
  body('quantity').isInt({ min: 0 }).withMessage('Quantity must be a non-negative integer'),
  body('available').isInt({ min: 0 }).withMessage('Available must be a non-negative integer')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const { name, description, fee, cmritFee, quantity, available, image, category, status } = req.body;

    const inventory = new Inventory({
      name,
      description,
      fee,
      cmritFee,
      quantity,
      available,
      image: image || '',
      category: category || 'general',
      status: status || 'available'
    });

    await inventory.save();

    res.status(201).json({
      message: 'Inventory item added successfully',
      inventory
    });
  } catch (error) {
    console.error('Add inventory error:', error);
    res.status(500).json({ message: 'Failed to add inventory item' });
  }
});

// Update inventory item (admin only)
router.put('/:id', authenticateToken, [
  body('name').optional().notEmpty().withMessage('Name cannot be empty'),
  body('description').optional().notEmpty().withMessage('Description cannot be empty'),
  body('fee').optional().isNumeric().withMessage('Fee must be a number'),
  body('cmritFee').optional().isNumeric().withMessage('CMRIT fee must be a number'),
  body('quantity').optional().isInt({ min: 0 }).withMessage('Quantity must be a non-negative integer'),
  body('available').optional().isInt({ min: 0 }).withMessage('Available must be a non-negative integer')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const inventory = await Inventory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!inventory) {
      return res.status(404).json({ message: 'Inventory item not found' });
    }

    res.json({
      message: 'Inventory item updated successfully',
      inventory
    });
  } catch (error) {
    console.error('Update inventory error:', error);
    res.status(500).json({ message: 'Failed to update inventory item' });
  }
});

// Delete inventory item (admin only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const inventory = await Inventory.findByIdAndDelete(req.params.id);

    if (!inventory) {
      return res.status(404).json({ message: 'Inventory item not found' });
    }

    res.json({
      message: 'Inventory item deleted successfully'
    });
  } catch (error) {
    console.error('Delete inventory error:', error);
    res.status(500).json({ message: 'Failed to delete inventory item' });
  }
});

// Book equipment (reduce available count)
router.post('/:id/book', optionalAuthenticateToken, async (req, res) => {
  try {
    const inventory = await Inventory.findById(req.params.id);

    if (!inventory) {
      return res.status(404).json({ message: 'Inventory item not found' });
    }

    if (inventory.available <= 0) {
      return res.status(400).json({ message: 'No equipment available for booking' });
    }

    if (inventory.status !== 'available') {
      return res.status(400).json({ message: 'Equipment is not available for booking' });
    }

    inventory.available -= 1;
    await inventory.save();

    res.json({
      message: 'Equipment booked successfully',
      available: inventory.available
    });
  } catch (error) {
    console.error('Book equipment error:', error);
    res.status(500).json({ message: 'Failed to book equipment' });
  }
});

export default router;

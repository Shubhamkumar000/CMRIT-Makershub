import express from 'express';
import { body, validationResult } from 'express-validator';
import Booking from '../models/Booking.js';
import { authenticateToken, requireStudent, optionalAuthenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Create new booking
router.post('/', optionalAuthenticateToken, [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('phone').trim().matches(/^\d{10}$/).withMessage('Phone must be 10 digits'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('serviceName').notEmpty().withMessage('Service name is required'),
  body('fee').isNumeric().withMessage('Fee must be a number'),
  body('date').notEmpty().withMessage('Date is required'),
  body('isCmritStudent').isBoolean().withMessage('CMRIT student status is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, phone, email, serviceName, fee, date, isCmritStudent, usn, branch } = req.body;

    // Generate unique invoice number
    const invoiceNumber = `INV-${Date.now().toString(36).toUpperCase()}`;

    const booking = new Booking({
      invoiceNumber,
      name,
      phone,
      email,
      userId: req.user?._id,
      serviceName,
      fee,
      date,
      isCmritStudent,
      usn: isCmritStudent ? usn : undefined,
      branch: isCmritStudent ? branch : undefined
    });

    await booking.save();

    res.status(201).json({
      message: 'Booking created successfully',
      booking: {
        id: booking._id,
        invoiceNumber: booking.invoiceNumber,
        serviceName: booking.serviceName,
        fee: booking.fee,
        date: booking.date,
        status: booking.status,
        paymentStatus: booking.paymentStatus,
        createdAt: booking.createdAt
      }
    });
  } catch (error) {
    console.error('Booking creation error:', error);
    res.status(500).json({ message: 'Failed to create booking' });
  }
});

// Get user's bookings
router.get('/my-bookings', authenticateToken, requireStudent, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .select('invoiceNumber serviceName fee date status paymentStatus createdAt');

    res.json({ bookings });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ message: 'Failed to fetch bookings' });
  }
});

// Get all bookings (admin only)
router.get('/', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const bookings = await Booking.find()
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 });

    res.json({ bookings });
  } catch (error) {
    console.error('Get all bookings error:', error);
    res.status(500).json({ message: 'Failed to fetch bookings' });
  }
});

// Update booking status (admin only)
router.patch('/:id/status', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const { status, paymentStatus } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status, paymentStatus },
      { new: true }
    ).populate('userId', 'name email');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json({
      message: 'Booking updated successfully',
      booking
    });
  } catch (error) {
    console.error('Update booking error:', error);
    res.status(500).json({ message: 'Failed to update booking' });
  }
});

export default router;

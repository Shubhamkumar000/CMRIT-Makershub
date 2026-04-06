import express from 'express';
import { body, validationResult } from 'express-validator';
import Ticket from '../models/Ticket.js';
import Notification from '../models/Notification.js';
import User from '../models/User.js';
import { authenticateToken, requireStudent } from '../middleware/auth.js';

const router = express.Router();

// Create new ticket
router.post('/', authenticateToken, requireStudent, [
  body('equipment').notEmpty().withMessage('Equipment is required'),
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Invalid priority')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { equipment, title, description, priority } = req.body;

    const ticket = new Ticket({
      userId: req.user._id,
      userName: req.user.name,
      userEmail: req.user.email,
      equipment,
      title,
      description,
      priority: priority || 'medium'
    });

    await ticket.save();

    // Create notifications for all admin users (non-blocking)
    try {
      const adminUsers = await User.find({ role: 'admin' }).select('_id');
      if (adminUsers.length > 0) {
        const adminNotifications = adminUsers.map((admin) => ({
          userId: admin._id,
          message: `New ticket: "${title}" from ${req.user.name}`,
          ticketId: ticket._id,
          type: 'ticket_created'
        }));
        await Notification.insertMany(adminNotifications);
      }
    } catch (notificationError) {
      console.error('Admin notification error:', notificationError);
    }

    res.status(201).json({
      message: 'Ticket created successfully',
      ticket
    });
  } catch (error) {
    console.error('Create ticket error:', error);
    res.status(500).json({ message: 'Failed to create ticket' });
  }
});

// Get user's tickets
router.get('/my-tickets', authenticateToken, requireStudent, async (req, res) => {
  try {
    const tickets = await Ticket.find({ userId: req.user._id })
      .sort({ createdAt: -1 });

    res.json({ tickets });
  } catch (error) {
    console.error('Get tickets error:', error);
    res.status(500).json({ message: 'Failed to fetch tickets' });
  }
});

// Get all tickets (admin only)
router.get('/', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const tickets = await Ticket.find()
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 });

    res.json({ tickets });
  } catch (error) {
    console.error('Get all tickets error:', error);
    res.status(500).json({ message: 'Failed to fetch tickets' });
  }
});

// Update ticket status (admin only)
router.patch('/:id/status', authenticateToken, [
  body('status').isIn(['open', 'in-progress', 'resolved']).withMessage('Invalid status'),
  body('assignedTo').optional().trim()
], async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { status, assignedTo } = req.body;

    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      { status, assignedTo: assignedTo || '' },
      { new: true }
    ).populate('userId', 'name email');

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Create notification for user if ticket is resolved
    if (status === 'resolved') {
      const userNotification = new Notification({
        userId: ticket.userId._id,
        message: `Your ticket "${ticket.title}" has been resolved!`,
        ticketId: ticket._id,
        type: 'ticket_resolved'
      });
      await userNotification.save();
    }

    res.json({
      message: 'Ticket updated successfully',
      ticket
    });
  } catch (error) {
    console.error('Update ticket error:', error);
    res.status(500).json({ message: 'Failed to update ticket' });
  }
});

// Delete ticket (admin only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const ticket = await Ticket.findByIdAndDelete(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Delete related notifications
    await Notification.deleteMany({ ticketId: req.params.id });

    res.json({
      message: 'Ticket deleted successfully'
    });
  } catch (error) {
    console.error('Delete ticket error:', error);
    res.status(500).json({ message: 'Failed to delete ticket' });
  }
});

export default router;

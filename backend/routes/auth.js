import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Register student
router.post('/register', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('phone').optional().isMobilePhone('any').withMessage('Valid phone number required'),
  body('usn').optional().trim(),
  body('branch').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, phone, usn, branch } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Determine if CMRIT student
    const isCmritStudent = !!(usn && branch);

    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: 'student',
      phone,
      usn: isCmritStudent ? usn : undefined,
      branch: isCmritStudent ? branch : undefined,
      isCmritStudent
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Student registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isCmritStudent: user.isCmritStudent,
        usn: user.usn,
        branch: user.branch
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed' });
  }
});

// Login (both student and admin)
router.post('/login', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isCmritStudent: user.isCmritStudent,
        usn: user.usn,
        branch: user.branch,
        phone: user.phone
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed' });
  }
});

// Get current user profile
router.get('/profile', authenticateToken, async (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      isCmritStudent: req.user.isCmritStudent,
      usn: req.user.usn,
      branch: req.user.branch,
      phone: req.user.phone
    }
  });
});

// Admin login (env-configured single admin)
router.post('/admin-login', [
  body('username').notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  try {
    const { username, password } = req.body;
    const inputUsername = username?.trim();
    const normalizedInput = inputUsername?.toLowerCase();

    const adminUsername = process.env.ADMIN_USERNAME?.trim();
    const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      return res.status(500).json({ message: 'Admin credentials are not configured on server' });
    }

    const usernameMatches = normalizedInput === adminEmail || (!!adminUsername && inputUsername === adminUsername);

    if (usernameMatches && password === adminPassword) {
      // Find or create admin user
      let adminUser = await User.findOne({ email: adminEmail });
      
      if (!adminUser) {
        const hashedPassword = await bcrypt.hash(adminPassword, 10);
        adminUser = new User({
          name: adminUsername || 'Administrator',
          email: adminEmail,
          password: hashedPassword,
          role: 'admin'
        });
        await adminUser.save();
      } else if (adminUser.role !== 'admin') {
        adminUser.role = 'admin';
        await adminUser.save();
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: adminUser._id, role: adminUser.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.json({
        message: 'Admin login successful',
        token,
        user: {
          id: adminUser._id,
          name: adminUser.name,
          email: adminUser.email,
          role: adminUser.role
        }
      });
    } else {
      res.status(401).json({ message: 'Invalid admin credentials' });
    }
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Admin login failed' });
  }
});

export default router;

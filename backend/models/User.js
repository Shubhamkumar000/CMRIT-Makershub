import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['student', 'admin'],
    default: 'student'
  },
  phone: {
    type: String,
    trim: true
  },
  usn: {
    type: String,
    trim: true,
    sparse: true // Allow multiple null values for non-CMRIT students
  },
  branch: {
    type: String,
    trim: true,
    sparse: true
  },
  isCmritStudent: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for faster queries
userSchema.index({ role: 1 });

export default mongoose.model('User', userSchema);

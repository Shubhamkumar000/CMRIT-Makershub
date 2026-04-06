import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  venue: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: ''
  },
  organizer: {
    type: String,
    default: 'CMRIT MakerSpace'
  },
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
    default: 'upcoming'
  },
  maxAttendees: {
    type: Number,
    default: 100
  },
  currentAttendees: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for faster queries
eventSchema.index({ date: 1 });
eventSchema.index({ status: 1 });

export default mongoose.model('Event', eventSchema);

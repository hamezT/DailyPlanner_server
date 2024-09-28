const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: Date, required: true },
  time: {
    start: { type: String, required: true },
    end: { type: String, required: true }
  },
  location: { type: String, default: 'online' },
  participants: [{ type: String }], // names of participants
  notes: { type: String },
  status: { type: String, enum: ['new', 'in-progress', 'completed', 'closed'], default: 'new' },
  reviewedBy: { type: String }, // the person who approved the task
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isReminderEnabled: { type: Boolean, default: false } // New field for reminder switch
});

module.exports = mongoose.model('Task', taskSchema);

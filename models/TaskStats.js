const mongoose = require('mongoose');

const taskStatsSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  tasksCreated: { type: Number, default: 0 },
  tasksCompleted: { type: Number, default: 0 },
  tasksInProgress: { type: Number, default: 0 },
  lastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('TaskStats', taskStatsSchema);

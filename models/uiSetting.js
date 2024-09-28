const mongoose = require('mongoose');

const uiSettingsSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  theme: { type: String, enum: ['dark', 'light'], default: 'light' },
  fontSize: { type: Number, default: 14 },
  colorScheme: { type: String, default: '#ffffff' },
});

module.exports = mongoose.model('UISettings', uiSettingsSchema);

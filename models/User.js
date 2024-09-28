const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // store hashed password
  name: { type: String, required: true }, // student's name
  role: { type: String, enum: ['student', 'admin'], default: 'student' }, // roles for potential future features
  theme: { type: String, enum: ['dark', 'light'], default: 'light' }, // for dark/light mode
  uiPreferences: {
    fontSize: { type: Number, default: 14 },
    colorScheme: { type: String, default: '#ffffff' },
    layout: { type: String, default: 'list' }
  }
});

module.exports = mongoose.model('User', userSchema);

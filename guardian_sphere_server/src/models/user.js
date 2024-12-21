const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  realName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  googleId: { type: String, default: null }, // Optional field for Google OAuth
  anonymousName: { type: String, default: '' },
  photo: { type: String, default: '/Pictures/default-avatar.png' },
  password: { type: String, required: true }, // Use bcrypt to hash passwords,
  contacted: { type: Number, default: 0 },
  points: { type: Number, default: 0 },
  organization: { type: String, default: '' },
  secter: { type: String, default: '' },  
  signaledcount: { type: Number, default: 0 },
  banned: { type: Boolean, default: false },
  role: { type: String, default: 'user' }, // user, admin
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;

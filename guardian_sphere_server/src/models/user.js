const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  realName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  googleId: { type: String, default: null }, // Optional field for Google OAuth
  anonymousName: { type: String, default: '' },
  photo: { type: String, default: '/Pictures/default-avatar.png' },
  password: { type: String, required: true }, // Use bcrypt to hash passwords,
  points: { type: Number, default: 0 },
  organization: { type: String, default: '' },
  secter: { type: String, default: '' },  
  banned: { type: Boolean, default: false },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;

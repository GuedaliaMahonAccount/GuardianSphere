const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
  realName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  googleId: { type: String, default: null },
  anonymousName: { type: String, default: '' },
  photo: { type: String, default: '/Pictures/default-avatar.png' },
  password: { type: String, required: true },
  contacted: { type: Number, default: 0 },
  points: { type: Number, default: 0 },
  organization: { type: String, default: '' },
  secter: { type: String, default: '' },
  code: { type: mongoose.Schema.Types.ObjectId, ref: 'Code' }, // Reference to the Code model
  signaledcount: { type: Number, default: 0 },
  banned: { type: Boolean, default: false },
  role: { type: String, default: 'user' },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;

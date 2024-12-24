const mongoose = require('mongoose');

const callSchema = new mongoose.Schema({
  id: { type: String, required: true }, // ID unique pour l'appel
  participants: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, required: true },
      username: { type: String, required: true },
      photo: { type: String, default: '/Pictures/default-avatar.png' },
    },
  ],
  status: { type: String, enum: ['active', 'ended'], default: 'active' },
  createdAt: { type: Date, default: Date.now },
});

const Call = mongoose.model('Call', callSchema);

module.exports = Call;

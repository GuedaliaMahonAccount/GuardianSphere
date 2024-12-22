const mongoose = require('mongoose'); // Add this line to import mongoose

const codeSchema = new mongoose.Schema({
  organization: { type: String, required: true },
  secter: { type: String, required: true },
  code: { type: String, required: true, unique: true }, // Ensure the code is unique
}, { timestamps: true });

const Code = mongoose.model('Code', codeSchema);

module.exports = Code;

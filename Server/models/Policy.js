const mongoose = require('mongoose');

const PolicySchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    premium: { type: Number, required: true },
    coverage: { type: Number, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('Policy', PolicySchema);

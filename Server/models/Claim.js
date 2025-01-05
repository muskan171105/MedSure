const mongoose = require('mongoose');

const ClaimSchema = new mongoose.Schema({
    policy: { type: mongoose.Schema.Types.ObjectId, ref: 'Policy', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['submitted', 'verified', 'approved', 'rejected'], default: 'submitted' },
    hospitalVerification: { type: Boolean, default: false },
    insuranceApproval: { type: Boolean, default: false }
});

module.exports = mongoose.model('Claim', ClaimSchema);

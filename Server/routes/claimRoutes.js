const express = require('express');
const Claim = require('../models/Claim');
const Policy = require('../models/Policy');
const { verifyToken, authorizeRole } = require('../middleware/authMiddleware');
const router = express.Router();

// Submit a Claim
router.post('/', verifyToken, async (req, res) => {
    const { policyId } = req.body;

    try {
        const policy = await Policy.findById(policyId);
        if (!policy) {
            return res.status(404).json({ error: 'Policy not found' });
        }

        const claim = new Claim({
            policy: policyId,
            user: req.user.id,
        });

        await claim.save();
        res.status(201).json({ message: 'Claim submitted successfully', claim });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Get All Claims (Admin View)
router.get('/', verifyToken, authorizeRole('insurance'), async (req, res) => {
    try {
        const claims = await Claim.find()
            .populate('policy', 'name')
            .populate('user', 'name email');
        res.json(claims);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Update Claim Status (Verify or Approve)
router.put('/:id', verifyToken, async (req, res) => {
    const { status } = req.body;

    try {
        const claim = await Claim.findById(req.params.id);
        if (!claim) {
            return res.status(404).json({ error: 'Claim not found' });
        }

        // Update claim status based on role
        if (req.user.role === 'hospital') {
            claim.hospitalVerification = status === 'verified';
        } else if (req.user.role === 'insurance') {
            claim.insuranceApproval = status === 'approved';
        }

        // Update overall claim status
        if (claim.hospitalVerification && claim.insuranceApproval) {
            claim.status = 'approved';
        } else if (status === 'rejected') {
            claim.status = 'rejected';
        }

        await claim.save();
        res.json({ message: 'Claim status updated', claim });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Get Claims for a Specific User
router.get('/my-claims', verifyToken, async (req, res) => {
    try {
        const claims = await Claim.find({ user: req.user.id })
            .populate('policy', 'name');
        res.json(claims);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;

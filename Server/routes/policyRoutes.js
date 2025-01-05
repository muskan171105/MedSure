const express = require('express');
const Policy = require('../models/Policy');
const router = express.Router();

// Add Policy
router.post('/', async (req, res) => {
    const { name, description, premium, coverage } = req.body;
    try {
        const policy = new Policy({ name, description, premium, coverage, createdBy: req.user.id });
        await policy.save();
        res.status(201).json(policy);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Get Policies
router.get('/', async (req, res) => {
    try {
        const policies = await Policy.find();
        res.json(policies);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const ServiceRequest = require('../models/ServiceRequest');
const User = require('../models/User');

router.post('/user-details', async (req, res) => {
    const { query } = req.body; 
    try {
        // Find user by Phone or Aadhaar
        const user = await User.findOne({
            $or: [{ phoneNumber: query }, { aadhaar: query }]
        });

        let requests = [];
        if (user) {
            // Find all services for this user
            requests = await ServiceRequest.find({ userId: user._id }).sort({ submittedAt: -1 });
        } else {
            // Fallback to SRN search
            requests = await ServiceRequest.find({ srn: query });
        }

        if (requests.length === 0) {
            return res.status(404).json({ success: false, message: "No records found" });
        }

        res.json({ 
            success: true, 
            userData: user || null, 
            data: requests 
        });
    } catch (err) {
        res.status(500).json({ success: false, error: "Search failed" });
    }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');

// Admin Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find admin by email
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(404).json({ success: false, message: "Admin not found" });
    }

    // Check password 
    if (admin.password !== password) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    // Success
    res.json({ 
      success: true, 
      message: "Login successful", 
      admin: { email: admin.email, role: admin.role } 
    });

  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
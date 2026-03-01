const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const twilio = require('twilio');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Razorpay = require('razorpay');
require('dotenv').config();

// --- 1. Import Models and Routes ---
const User = require('./models/User'); 
const Admin = require('./models/Admin');
const ServiceRequest = require('./models/ServiceRequest'); 
const adminRoutes = require('./routes/adminRoutes');
const userSearchRoutes = require('./routes/userSearchRoutes'); 

const app = express();

// --- 2. Middleware ---
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads')); 


const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});
// --- 3. File Storage Setup ---
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage: storage });

// --- 4. Database Schema for Complaints ---
// This ensures complaints are stored in MongoDB, not just localStorage
const complaintSchema = new mongoose.Schema({
    srn: { type: String, required: true, unique: true },
    citizen: String,
    phone: String,
    dept: String,
    category: String,
    status: { type: String, default: "Pending" },
    date: { type: String, default: () => new Date().toISOString().split('T')[0] },
    location: String,
    coordinates: {
        lat: Number,
        lng: Number
    },
    remarks: { type: String, default: "Technician will be assigned shortly." },
    description: String,
    createdAt: { type: Date, default: Date.now }
});

const Complaint = mongoose.model('Complaint', complaintSchema);

// --- 5. Database Connection ---
mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        console.log("✅ MongoDB Connected");
        const adminExists = await Admin.findOne({ email: "admin@test.com" });
        if (!adminExists) {
            await Admin.create({
                email: "admin@test.com",
                password: "admin123" 
            });
            console.log("👤 Default Admin Created");
        }
    })
    .catch(err => console.log("❌ DB Error:", err));

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// --- 6. API ROUTES ---

app.use('/api/search', userSearchRoutes);
app.use('/api/admin', adminRoutes);

// --- USER AUTH ---
app.post('/api/send-otp', async (req, res) => {
    const { phoneNumber, aadhaar, type } = req.body;
    try {
        const existingUser = await User.findOne({ $or: [{ phoneNumber }, { aadhaar }] });
        if (type === 'register' && existingUser) return res.status(400).json({ success: false, error: "Already registered" });
        if (type === 'login' && !existingUser) return res.status(404).json({ success: false, error: "User not found" });

        await client.verify.v2.services(process.env.TWILIO_VERIFY_SERVICE_SID)
            .verifications.create({ to: phoneNumber, channel: 'sms' });
        res.json({ success: true, message: "OTP sent" });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

app.post('/api/verify-otp', async (req, res) => {
    const { phoneNumber, code, name, aadhaar, type } = req.body;
    try {
        const check = await client.verify.v2.services(process.env.TWILIO_VERIFY_SERVICE_SID)
            .verificationChecks.create({ to: phoneNumber, code: code });

        if (check.status === 'approved') {
            let user;
            if (type === 'register') {
                user = await new User({ name, aadhaar, phoneNumber }).save();
            } else {
                user = await User.findOne({ phoneNumber });
            }
            res.json({ success: true, user });
        } else { res.status(400).json({ success: false, message: "Invalid OTP" }); }
    } catch (err) { res.status(500).json({ success: false, message: "Error" }); }
});

// --- COMPLAINTS SECTION API ---

// 1. Submit a New Complaint
app.post('/api/complaints/submit', async (req, res) => {
    try {
        const newComplaint = new Complaint(req.body);
        await newComplaint.save();

        // Optional: Send SMS via Twilio
        if (req.body.phone) {
            try {
                await client.messages.create({
                    body: `Nagar-Setu: Complaint Logged! SRN: ${req.body.srn}. Status: Pending.`,
                    from: process.env.TWILIO_PHONE_NUMBER,
                    to: req.body.phone
                });
            } catch (smsErr) { console.log("SMS failed, but complaint saved."); }
        }

        res.status(201).json({ success: true, srn: req.body.srn });
    } catch (err) {
        res.status(500).json({ success: false, error: "Complaint submission failed" });
    }
});

// 2. Get Complaints for a specific User (by Phone)
app.get('/api/complaints/user/:phone', async (req, res) => {
    try {
        const complaints = await Complaint.find({ phone: req.params.phone }).sort({ createdAt: -1 });
        res.json({ success: true, complaints });
    } catch (err) {
        res.status(500).json({ success: false, error: "Fetch failed" });
    }
});

// 3. Admin: Get All Complaints
app.get('/api/complaints/admin/all', async (req, res) => {
    try {
        const complaints = await Complaint.find().sort({ createdAt: -1 });
        res.json({ success: true, complaints });
    } catch (err) {
        res.status(500).json({ success: false, error: "Fetch failed" });
    }
});

// 4. Admin: Update Complaint Status (Reflects on user side)
app.patch('/api/complaints/update-status', async (req, res) => {
    const { srn, status, remarks } = req.body;
    try {
        const updated = await Complaint.findOneAndUpdate(
            { srn },
            { status, remarks },
            { new: true }
        );
        if (!updated) return res.status(404).json({ success: false, message: "SRN not found" });
        res.json({ success: true, complaint: updated });
    } catch (err) {
        res.status(500).json({ success: false, error: "Update failed" });
    }
});

// --- ORIGINAL SERVICE REQUESTS ---
app.post('/api/submit', upload.single('pdfFile'), async (req, res) => {
    try {
        let details = JSON.parse(req.body.details);
        const userPhone = details.contact_number || details.phone || details.phoneNumber;
        const registeredUser = await User.findOne({ phoneNumber: userPhone });

        const newRequest = new ServiceRequest({
            userId: registeredUser ? registeredUser._id : null,
            formType: req.body.formType,
            srn: req.body.srn,
            details: details,
            pdfPath: req.file ? req.file.path : null,
            status: "Pending",
            remarks: "Document received and awaiting verification.",
            submittedAt: new Date()
        });

        await newRequest.save();
        res.status(200).json({ success: true, srn: req.body.srn });
    } catch (err) { res.status(500).json({ error: "Submission failed" }); }
});

// --- NOTIFICATIONS ---
const notificationSchema = new mongoose.Schema({
    title: String,
    body: String,
    target: String,
    createdAt: { type: Date, default: Date.now }
});
const Notification = mongoose.model('Notification', notificationSchema);

app.get('/api/notifications', async (req, res) => {
    try {
        const notifications = await Notification.find().sort({ createdAt: -1 });
        res.json({ success: true, notifications });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

app.post('/api/send-notification', async (req, res) => {
    try {
        const newNotif = new Notification(req.body);
        await newNotif.save();
        res.json({ success: true, message: "Sent!" });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

app.delete('/api/notifications/:id', async (req, res) => {
    try {
        await Notification.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "Deleted" });
    } catch (err) { res.status(500).json({ success: false, message: "ID error" }); }
});

app.get('/api/user-requests/:phone', async (req, res) => {
    try {
        const phone = req.params.phone;
        // Find user first to get their ID
        const user = await User.findOne({ phoneNumber: phone });
        
        let query = { "details.phone": phone }; // Fallback if no user linked
        if (user) {
            query = { $or: [{ userId: user._id }, { "details.phone": phone }] };
        }

        const requests = await ServiceRequest.find(query).sort({ submittedAt: -1 });
        
        res.json({ 
            success: true, 
            requests: requests.map(r => ({
                srn: r.srn,
                status: r.status,
                formType: r.formType,
                remarks: r.remarks
            }))
        });
    } catch (err) {
        console.error("Fetch error:", err);
        res.status(500).json({ success: false, error: "Fetch failed" });
    }
});

// 2. Track a specific request by SRN
app.get('/api/track/:srn', async (req, res) => {
    try {
        const request = await ServiceRequest.findOne({ srn: req.params.srn });
        if (!request) return res.status(404).json({ success: false, message: "SRN not found" });
        
        res.json({ 
            success: true, 
            status: request.status, 
            remarks: request.remarks 
        });
    } catch (err) {
        res.status(500).json({ success: false, error: "Tracking failed" });
    }
});

// --- server.js ---

// 1. Get ALL Service Requests for Admin
app.get('/api/admin/all-requests', async (req, res) => {
    try {
        const requests = await ServiceRequest.find().sort({ submittedAt: -1 });
        res.json({ success: true, requests });
    } catch (err) {
        res.status(500).json({ success: false, error: "Database fetch failed" });
    }
});

// 2. Admin Update Status
app.post('/api/admin/update-status', async (req, res) => {
    const { srn, newStatus, remarks } = req.body;
    try {
        const updated = await ServiceRequest.findOneAndUpdate(
            { srn },
            { status: newStatus, remarks: remarks },
            { new: true }
        );
        if (!updated) return res.status(404).json({ success: false, message: "SRN not found" });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, error: "Update failed" });
    }
});

// --- ADMIN: USER MANAGEMENT API ---

// 1. Get all registered users for the Admin Dashboard
app.get('/api/admin/users', async (req, res) => {
    try {
        const users = await User.find().sort({ createdAt: -1 });
        res.json({ success: true, users });
    } catch (err) {
        res.status(500).json({ success: false, message: "Could not fetch users" });
    }
});

// 2. Get Statistics
app.get('/api/admin/stats', async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        const complaintCount = await Complaint.countDocuments({ status: "Pending" });
        const serviceCount = await ServiceRequest.countDocuments({ status: "Pending" });
        res.json({ success: true, userCount, complaintCount, serviceCount });
    } catch (err) {
        res.status(500).json({ success: false, message: "Stats fetch failed" });
    }
});



// --- BILLING SCHEMA (Matches Admin Panel) ---
const billSchema = new mongoose.Schema({
    userPhone: String,
    type: String, // Electricity, Water, etc.
    amount: Number,
    releaseDate: { type: Date, default: Date.now },
    lastDate: Date,
    status: { type: String, default: "Unpaid" },
    fineAmount: { type: Number, default: 0 },
    razorpay_order_id: String,
    razorpay_payment_id: String,
    datePaid: Date
});
const Bill = mongoose.model('Bill', billSchema);

// --- BILLING & PAYMENT ROUTES ---

// --- ROUTES ---

// 1. Create Order for Razorpay
// --- RAZORPAY ORDER CREATION (PRODUCTION READY) ---
app.post('/api/create-order', async (req, res) => {
    try {
        const { amount } = req.body;
        
        // 1. Validate Amount
        if (!amount || isNaN(amount) || amount <= 0) {
            return res.status(400).json({ success: false, error: "Invalid amount. Must be a positive number." });
        }

        // 2. Convert to Paise (Integer only)
        const amountInPaise = Math.round(parseFloat(amount) * 100);

        const options = {
            amount: amountInPaise, 
            currency: "INR",
            receipt: `rcpt_bill_${Date.now()}`,
        };

        // 3. Create Order
        const order = await razorpay.orders.create(options);
        
        // 4. Send Order ID to Frontend
        res.json({
            success: true,
            id: order.id,
            currency: order.currency,
            amount: order.amount
        });

    } catch (err) {
        console.error("CRITICAL RAZORPAY ERROR:", err.message);
        res.status(500).json({ 
            success: false, 
            error: "Payment gateway communication failed.",
            details: err.description || err.message 
        });
    }
});

// 2. Verify and Update Bill
app.post('/api/verify-payment', async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, billId, amount } = req.body;
        
        const updatedBill = await Bill.findByIdAndUpdate(billId, {
            status: 'Paid',
            razorpay_order_id,
            razorpay_payment_id,
            datePaid: new Date(),
            amount: amount
        }, { new: true });

        res.json({ success: true, bill: updatedBill });
    } catch (err) {
        res.status(500).json({ error: "Verification Failed" });
    }
});

// 3. Get User Bills
app.get('/api/bills/user/:phone', async (req, res) => {
    try {
        const bills = await Bill.find({ userPhone: req.params.phone }).sort({ releaseDate: -1 });
        res.json({ success: true, bills });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// 4. Get Payment History
app.get('/api/history/:phone', async (req, res) => {
    try {
        const history = await Bill.find({ userPhone: req.params.phone, status: 'Paid' }).sort({ datePaid: -1 });
        res.json(history);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// 5. Admin: Create Bill
app.post('/api/bills/create', async (req, res) => {
    try {
        const bill = new Bill(req.body);
        await bill.save();
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));
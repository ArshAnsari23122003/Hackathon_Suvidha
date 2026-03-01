const mongoose = require('mongoose');

const ServiceRequestSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
    srn: { type: String, required: true, unique: true },
    formType: { type: String, required: true },
    details: { type: Object, required: true },
    pdfPath: { type: String },
    status: { type: String, default: "Pending" },
    remarks: { type: String, default: "Awaiting verification" },
    submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ServiceRequest', ServiceRequestSchema);
// server.js - Main Backend Server with Stripe Payment Integration
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const emailService = require('./emailService');

// Load environment variables FIRST
dotenv.config();

// Initialize Stripe with secret key
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/flashlink');
        console.log('✅ MongoDB Connected Successfully');
    } catch (error) {
        console.error('❌ MongoDB Connection Error:', error.message);
        process.exit(1);
    }
};

connectDB();

// ==================== MODELS ====================

// Contact Form Schema
const contactSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, default: 'new', enum: ['new', 'contacted', 'resolved'] },
    createdAt: { type: Date, default: Date.now },
});

// Shipping Quote Schema
const quoteSchema = new mongoose.Schema({
    weight: { type: Number, required: true },
    shippingType: { type: String, required: true, enum: ['sea', 'air', 'express'] },
    estimatedCost: { type: Number, required: true },
    deliveryTime: { type: String, required: true },
    customerEmail: { type: String },
    customerName: { type: String },
    customerPhone: { type: String },
    status: { type: String, default: 'pending', enum: ['pending', 'confirmed', 'cancelled'] },
    createdAt: { type: Date, default: Date.now }
});

// Payment Schema
const paymentSchema = new mongoose.Schema({
    paymentIntentId: { type: String, required: true, unique: true },
    orderNumber: { type: String, required: true },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'usd' },
    status: { type: String, default: 'pending', enum: ['pending', 'succeeded', 'failed', 'canceled'] },
    paymentMethod: { type: String },
    receiptUrl: { type: String },
    createdAt: { type: Date, default: Date.now },
    completedAt: { type: Date }
});

// Order/Shipment Schema
const shipmentSchema = new mongoose.Schema({
    orderNumber: { type: String, required: true, unique: true },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    customerPhone: { type: String, required: true },
    origin: { type: String, default: 'China' },
    destination: { type: String, default: 'Burundi' },
    weight: { type: Number, required: true },
    shippingType: { type: String, required: true },
    cost: { type: Number, required: true },
    paymentStatus: { type: String, default: 'pending', enum: ['pending', 'paid', 'failed'] },
    paymentIntentId: { type: String },
    status: {
        type: String,
        default: 'pending',
        enum: ['pending', 'picked_up', 'in_transit', 'customs', 'out_for_delivery', 'delivered']
    },
    trackingUpdates: [{
        status: String,
        location: String,
        date: { type: Date, default: Date.now },
        note: String
    }],
    createdAt: { type: Date, default: Date.now },
    estimatedDelivery: Date
});

// User Schema (for admin)
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'admin', enum: ['admin', 'staff'] },
    createdAt: { type: Date, default: Date.now }
});

// Create Models
const Contact = mongoose.model('Contact', contactSchema);
const Quote = mongoose.model('Quote', quoteSchema);
const Payment = mongoose.model('Payment', paymentSchema);
const Shipment = mongoose.model('Shipment', shipmentSchema);
const User = mongoose.model('User', userSchema);

// ==================== ROUTES ====================

// Health Check
app.get('/', (req, res) => {
    res.json({
        message: '🚢 Flash Link API is running!',
        version: '1.0.0',
        status: 'active',
        stripe: process.env.STRIPE_SECRET_KEY ? 'configured' : 'not configured'
    });
});

// ===== CONTACT FORM ROUTES =====

// Submit Contact Form
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, phone, message } = req.body;

        if (!name || !email || !phone || !message) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        const contact = new Contact({ name, email, phone, message });
        await contact.save();

        await emailService.sendContactConfirmation(email, name);
        await emailService.sendAdminNotification(process.env.EMAIL_USER, contact);

        res.status(201).json({
            success: true,
            message: 'Thank you! We will contact you soon. Check your email!',
            data: contact
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error. Please try again.',
            error: error.message
        });
    }
});

// Get All Contacts (Admin)
app.get('/api/contacts', async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ createdAt: -1 });
        res.json({ success: true, data: contacts });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Update Contact Status (Admin)
app.patch('/api/contact/:id', async (req, res) => {
    try {
        const { status } = req.body;
        const contact = await Contact.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        res.json({ success: true, data: contact });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ===== QUOTE ROUTES =====

// Create Quote
app.post('/api/quote', async (req, res) => {
    try {
        const { weight, shippingType, estimatedCost, deliveryTime, customerEmail, customerName, customerPhone } = req.body;

        const quote = new Quote({
            weight,
            shippingType,
            estimatedCost,
            deliveryTime,
            customerEmail,
            customerName,
            customerPhone
        });

        await quote.save();

        res.status(201).json({
            success: true,
            message: 'Quote saved successfully',
            data: quote
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get All Quotes (Admin)
app.get('/api/quotes', async (req, res) => {
    try {
        const quotes = await Quote.find().sort({ createdAt: -1 });
        res.json({ success: true, data: quotes });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ===== PAYMENT ROUTES (STRIPE) =====

// Create Payment Intent
app.post('/api/create-payment-intent', async (req, res) => {
    try {
        const { amount, weight, shippingType, customerEmail, customerName, customerPhone } = req.body;

        // Validation
        if (!amount || !customerEmail || !customerName) {
            return res.status(400).json({
                success: false,
                message: 'Missing required payment information'
            });
        }

        // Generate unique order number
        const orderNumber = 'FL' + Date.now();

        // Create payment intent with Stripe
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Convert dollars to cents
            currency: 'usd',
            metadata: {
                orderNumber,
                customerEmail,
                customerName,
                weight: weight?.toString() || 'N/A',
                shippingType: shippingType || 'N/A'
            },
            receipt_email: customerEmail,
            description: `Flash Link Shipping - Order ${orderNumber}`
        });

        // Save payment record to database
        const payment = new Payment({
            paymentIntentId: paymentIntent.id,
            orderNumber,
            customerName,
            customerEmail,
            amount,
            status: 'pending'
        });

        await payment.save();

        console.log('✅ Payment Intent created:', paymentIntent.id);

        res.json({
            success: true,
            clientSecret: paymentIntent.client_secret,
            orderNumber,
            paymentIntentId: paymentIntent.id
        });
    } catch (error) {
        console.error('❌ Payment error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Confirm Payment and Create Shipment
app.post('/api/confirm-payment', async (req, res) => {
    try {
        const { paymentIntentId, orderNumber, customerName, customerEmail, customerPhone, weight, shippingType, amount } = req.body;

        // Verify payment with Stripe
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

        if (paymentIntent.status !== 'succeeded') {
            return res.status(400).json({
                success: false,
                message: 'Payment not completed'
            });
        }

        // Update payment record
        await Payment.findOneAndUpdate(
            { paymentIntentId },
            {
                status: 'succeeded',
                completedAt: new Date(),
                paymentMethod: paymentIntent.payment_method
            }
        );

        // Calculate estimated delivery
        const deliveryDays = {
            sea: 30,
            air: 10,
            express: 5
        };
        const estimatedDelivery = new Date();
        estimatedDelivery.setDate(estimatedDelivery.getDate() + (deliveryDays[shippingType] || 10));

        // Create shipment
        const shipment = new Shipment({
            orderNumber,
            customerName,
            customerEmail,
            customerPhone: customerPhone || 'N/A',
            weight,
            shippingType,
            cost: amount,
            paymentStatus: 'paid',
            paymentIntentId,
            estimatedDelivery,
            trackingUpdates: [{
                status: 'pending',
                location: 'China',
                note: 'Payment confirmed. Order processing started.'
            }]
        });

        await shipment.save();

        console.log('✅ Shipment created:', orderNumber);

        res.json({
            success: true,
            message: 'Payment successful! Your shipment has been created.',
            data: {
                orderNumber,
                shipment,
                receiptUrl: paymentIntent.charges?.data[0]?.receipt_url
            }
        });
    } catch (error) {
        console.error('❌ Payment confirmation error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Get All Payments (Admin)
app.get('/api/payments', async (req, res) => {
    try {
        const payments = await Payment.find().sort({ createdAt: -1 });
        res.json({ success: true, data: payments });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get Payment by Order Number
app.get('/api/payment/:orderNumber', async (req, res) => {
    try {
        const payment = await Payment.findOne({ orderNumber: req.params.orderNumber });
        if (!payment) {
            return res.status(404).json({
                success: false,
                message: 'Payment not found'
            });
        }
        res.json({ success: true, data: payment });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ===== SHIPMENT ROUTES =====

// Create Shipment
app.post('/api/shipment', async (req, res) => {
    try {
        const { customerName, customerEmail, customerPhone, weight, shippingType, cost, estimatedDelivery } = req.body;

        const orderNumber = 'FL' + Date.now();

        const shipment = new Shipment({
            orderNumber,
            customerName,
            customerEmail,
            customerPhone,
            weight,
            shippingType,
            cost,
            estimatedDelivery,
            trackingUpdates: [{
                status: 'pending',
                location: 'China',
                note: 'Order received and processing'
            }]
        });

        await shipment.save();

        res.status(201).json({
            success: true,
            message: 'Shipment created successfully',
            data: shipment
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get All Shipments (Admin)
app.get('/api/shipments', async (req, res) => {
    try {
        const shipments = await Shipment.find().sort({ createdAt: -1 });
        res.json({ success: true, data: shipments });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Track Shipment (Public)
app.get('/api/track/:orderNumber', async (req, res) => {
    try {
        const shipment = await Shipment.findOne({ orderNumber: req.params.orderNumber });

        if (!shipment) {
            return res.status(404).json({
                success: false,
                message: 'Shipment not found'
            });
        }

        res.json({ success: true, data: shipment });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Update Shipment Status (Admin)
app.patch('/api/shipment/:id', async (req, res) => {
    try {
        const { status, location, note } = req.body;

        const shipment = await Shipment.findById(req.params.id);

        if (!shipment) {
            return res.status(404).json({ success: false, message: 'Shipment not found' });
        }

        if (status) shipment.status = status;

        shipment.trackingUpdates.push({
            status: status || shipment.status,
            location: location || 'In Transit',
            note: note || 'Status updated'
        });

        await shipment.save();

        res.json({
            success: true,
            message: 'Shipment updated successfully',
            data: shipment
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ===== STATISTICS ROUTES (Admin Dashboard) =====

app.get('/api/stats', async (req, res) => {
    try {
        const totalShipments = await Shipment.countDocuments();
        const pendingShipments = await Shipment.countDocuments({ status: 'pending' });
        const inTransitShipments = await Shipment.countDocuments({ status: 'in_transit' });
        const deliveredShipments = await Shipment.countDocuments({ status: 'delivered' });
        const totalContacts = await Contact.countDocuments();
        const newContacts = await Contact.countDocuments({ status: 'new' });
        const totalPayments = await Payment.countDocuments();
        const successfulPayments = await Payment.countDocuments({ status: 'succeeded' });
        const totalRevenue = await Payment.aggregate([
            { $match: { status: 'succeeded' } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);

        res.json({
            success: true,
            data: {
                totalShipments,
                pendingShipments,
                inTransitShipments,
                deliveredShipments,
                totalContacts,
                newContacts,
                totalPayments,
                successfulPayments,
                totalRevenue: totalRevenue[0]?.total || 0
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ===== ERROR HANDLING =====

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        error: err.message
    });
});

// ==================== START SERVER ====================

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📡 API available at http://localhost:${PORT}`);
    console.log(`💳 Stripe: ${process.env.STRIPE_SECRET_KEY ? '✅ Configured' : '❌ Not configured'}`);
});
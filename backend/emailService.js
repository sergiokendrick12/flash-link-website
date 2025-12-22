// emailService.js - Email Notification System
const nodemailer = require('nodemailer');

// Create email transporter
const createTransporter = () => {
    return nodemailer.createTransport({
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: process.env.EMAIL_PORT || 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });
};

// Email Templates
const emailTemplates = {
    // Contact Form Confirmation
    contactConfirmation: (name) => ({
        subject: '✅ We Received Your Message - Flash Link',
        html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #f97316 0%, #1e3a8a 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { background: #f97316; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; display: inline-block; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🚢 FLASH LINK</h1>
            <p>Logistic & Trading Company</p>
          </div>
          <div class="content">
            <h2>Hello ${name}! 👋</h2>
            <p>Thank you for contacting Flash Link! We have received your message and our team will review it shortly.</p>
            <p><strong>What happens next?</strong></p>
            <ul>
              <li>Our team will review your inquiry within 24 hours</li>
              <li>We'll reach out via email or phone to discuss your needs</li>
              <li>Get a personalized shipping quote</li>
            </ul>
            <a href="https://wa.me/8618202076473" class="button">Chat with us on WhatsApp</a>
            <p>If you have any urgent questions, feel free to contact us directly:</p>
            <p>📞 China: +86 182 0207 6473<br>
            📧 Email: info@flashlink.com</p>
          </div>
          <div class="footer">
            <p>© 2025 Flash Link Logistic & Trading Company</p>
            <p>Connecting China and Burundi</p>
          </div>
        </div>
      </body>
      </html>
    `
    }),

    // Admin Notification
    adminNotification: (contact) => ({
        subject: '🔔 New Contact Form Submission - Flash Link',
        html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #f97316 0%, #1e3a8a 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; }
          .info-box { background: white; border-left: 4px solid #f97316; padding: 15px; margin: 15px 0; border-radius: 5px; }
          .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 12px; border-radius: 0 0 10px 10px; background: #f9fafb; padding: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔔 New Contact Submission</h1>
          </div>
          <div class="content">
            <h2>New message received!</h2>
            <div class="info-box">
              <p><strong>Name:</strong> ${contact.name}</p>
              <p><strong>Email:</strong> ${contact.email}</p>
              <p><strong>Phone:</strong> ${contact.phone}</p>
              <p><strong>Time:</strong> ${new Date(contact.createdAt).toLocaleString()}</p>
            </div>
            <div class="info-box">
              <p><strong>Message:</strong></p>
              <p>${contact.message}</p>
            </div>
            <p><a href="http://localhost:3000/admin">View in Admin Dashboard →</a></p>
          </div>
          <div class="footer">
            <p>Flash Link Admin Notification</p>
          </div>
        </div>
      </body>
      </html>
    `
    }),

    // Quote Email
    quoteEmail: (name, quote) => ({
        subject: '💰 Your Shipping Quote - Flash Link',
        html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #f97316 0%, #1e3a8a 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; }
          .quote-box { background: white; border: 2px solid #f97316; border-radius: 10px; padding: 20px; margin: 20px 0; }
          .quote-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
          .total { font-size: 24px; font-weight: bold; color: #f97316; margin-top: 15px; }
          .button { background: #f97316; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; display: inline-block; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 12px; border-radius: 0 0 10px 10px; background: #f9fafb; padding: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🚢 FLASH LINK</h1>
            <p>Your Shipping Quote is Ready!</p>
          </div>
          <div class="content">
            <h2>Hello ${name}! 📦</h2>
            <p>Here's your personalized shipping quote from China to Burundi:</p>
            
            <div class="quote-box">
              <h3 style="color: #f97316; margin-top: 0;">Quote Details</h3>
              <div class="quote-row">
                <span><strong>Weight:</strong></span>
                <span>${quote.weight} kg</span>
              </div>
              <div class="quote-row">
                <span><strong>Shipping Method:</strong></span>
                <span style="text-transform: capitalize;">${quote.shippingType}</span>
              </div>
              <div class="quote-row">
                <span><strong>Delivery Time:</strong></span>
                <span>${quote.deliveryTime}</span>
              </div>
              <div class="quote-row" style="border: none;">
                <span><strong>Total Cost:</strong></span>
                <span class="total">$${quote.estimatedCost}</span>
              </div>
            </div>

            <p><strong>This quote includes:</strong></p>
            <ul>
              <li>✅ Pickup from China</li>
              <li>✅ International shipping</li>
              <li>✅ Customs clearance</li>
              <li>✅ Delivery to Burundi</li>
              <li>✅ Insurance coverage</li>
              <li>✅ Real-time tracking</li>
            </ul>

            <center>
              <a href="https://wa.me/8618202076473" class="button">Book This Shipment</a>
            </center>

            <p style="color: #6b7280; font-size: 12px; margin-top: 20px;">
              * Quote valid for 7 days. Final price may vary based on exact dimensions and customs fees.
            </p>
          </div>
          <div class="footer">
            <p><strong>Contact Us:</strong></p>
            <p>📞 +86 182 0207 6473 | 📧 info@flashlink.com</p>
            <p>© 2025 Flash Link Logistic & Trading Company</p>
          </div>
        </div>
      </body>
      </html>
    `
    })
};

// Send Email Functions
const sendEmail = async (to, template) => {
    try {
        const transporter = createTransporter();

        const mailOptions = {
            from: `"Flash Link Logistics" <${process.env.EMAIL_USER}>`,
            to: to,
            subject: template.subject,
            html: template.html
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Email sent:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Email error:', error);
        return { success: false, error: error.message };
    }
};

// Export functions
module.exports = {
    sendContactConfirmation: (email, name) =>
        sendEmail(email, emailTemplates.contactConfirmation(name)),

    sendAdminNotification: (adminEmail, contact) =>
        sendEmail(adminEmail, emailTemplates.adminNotification(contact)),

    sendQuoteEmail: (email, name, quote) =>
        sendEmail(email, emailTemplates.quoteEmail(name, quote))
};
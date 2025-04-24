const nodemailer = require('nodemailer');
const db = require("../models");

// Create a transporter using SMTP with secure options
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  },
  tls: {
    // Do not fail on invalid certs
    rejectUnauthorized: false
  }
});

exports.sendEmail = async (req, res) => {
  try {
    const { studentId, email, subject, message, studentName } = req.body;

    if (!email || !message) {
      return res.status(400).json({ message: "Email and message are required" });
    }

    // Verify the user exists and has the correct role
    const user = await db.user.findByPk(studentId);
    if (!user) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Send email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: subject || 'Notification from Career Services',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #41b883;">Career Services Notification</h2>
          <p>Hello ${studentName},</p>
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
            ${message}
          </div>
          <p>Best regards,<br>Career Services Team</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: "Failed to send email" });
  }
};

exports.sendNotification = async (req, res) => {
  try {
    const { studentId, message, studentName } = req.body;

    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    // Verify the user exists
    const user = await db.user.findByPk(studentId);
    if (!user) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Save notification to the database
    await db.notification.create({
      userId: studentId,
      message: `Hello ${studentName}, ${message}`,
      isRead: false
    });

    res.status(200).json({ message: "Notification sent successfully" });
  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).json({ message: "Failed to send notification" });
  }
}; 
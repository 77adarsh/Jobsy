import express from 'express';
import User from '../models/User.js';
import PasswordReset from '../models/PasswordReset.js';
import nodemailer from 'nodemailer';
import { check, validationResult } from 'express-validator';

const router = express.Router();


// Password Generator Function
const generateRandomPassword = () => {
  const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
  
  let password = '';
  
  // Generate 8 character password with mix of uppercase and lowercase
  for (let i = 0; i < 4; i++) {
    password += uppercaseChars.charAt(Math.floor(Math.random() * uppercaseChars.length));
    password += lowercaseChars.charAt(Math.floor(Math.random() * lowercaseChars.length));
  }

  // Shuffle the password characters
  return password.split('').sort(() => 0.5 - Math.random()).join('');
};

// Forgot Password Route
router.post('/forgot-password', [
  check('email', 'Please include a valid email').isEmail()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email } = req.body;
    
    // Find user by email
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    // Check if user already requested password reset in the last 24 hours
    const lastReset = await PasswordReset.findOne({
      userId: user._id,
      createdAt: { $gt: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    });

    if (lastReset) {
      return res.status(400).json({ 
        msg: 'You can only request a password reset once per day. Please try again tomorrow.'
      });
    }
    
    // Generate new password
    const newPassword = generateRandomPassword();
    
    // Update user password in DB
    user.password = newPassword;
    await user.save();
    
    // Create password reset record
    await PasswordReset.create({
      userId: user._id,
      requestedAt: new Date()
    });

    // Send email with new password
    const transporter = nodemailer.createTransport({
      // Configure your email provider here
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      }
    });
    
    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: email,
      subject: 'Your Password Reset',
      html: `
        <h1>Password Reset</h1>
        <p>Your password has been reset. Here is your new temporary password:</p>
        <h2>${newPassword}</h2>
        <p>Please login with this password and change it immediately.</p>
      `
    };
    
    await transporter.sendMail(mailOptions);
    
    res.json({ msg: 'Password reset email sent' });
    
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

export default router;
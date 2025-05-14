// controllers/authController.js - Updated for temporary password flow
import User from '../models/User.js';
import PasswordReset from '../models/PasswordReset.js';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { validationResult } from 'express-validator';

// Helper function to generate JWT
const generateToken = (id, isTemporary = false) => {
  return jwt.sign({ 
    id,
    isTemporaryPassword: isTemporary 
  }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '24h',
  });
};

// Password Generator Function
const generateRandomPassword = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let password = '';
  for (let i = 0; i < 8; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

// *******************
//  User Registration
// *******************
export const registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('/register Validation errors:', errors.array());
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password } = req.body;

  try {
    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Create new user
    user = new User({
      name,
      email,
      password, // Password will be hashed by the pre-save middleware
      isTemporaryPassword: false
    });

    await user.save();

    // Generate JWT
    const token = generateToken(user._id);

    res.status(201).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error('/register Error:', err.message);
    res.status(500).send('Server error');
  }
};

// ***************
//  User Login
// ***************
export const loginUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('/login Validation errors:', errors.array());
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;
  console.log(`Login attempt for email: ${email}`);

  try {
    // Find user by email WITH password and isTemporaryPassword fields included
    const user = await User.findOne({ email }).select('+password +isTemporaryPassword');

    if (!user) {
      console.log(`Login failed: User with email ${email} not found`);
      return res.status(401).json({ msg: 'Invalid credentials' });
    }

    console.log(`User found, password from DB: ${user.password ? 'exists' : 'missing'}`);
    
    // Direct comparison with bcrypt
    const isMatch = await bcrypt.compare(password, user.password);
    console.log(`Password comparison result: ${isMatch ? 'match' : 'no match'}`);

    if (!isMatch) {
      console.log('Login failed: Password does not match');
      return res.status(401).json({ msg: 'Invalid credentials' });
    }

    // Generate JWT - include isTemporaryPassword flag if the password is temporary
    const token = generateToken(user._id, user.isTemporaryPassword);

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        requiresPasswordChange: user.isTemporaryPassword
      },
    });
  } catch (err) {
    console.error('/login Error:', err.message);
    res.status(500).send('Server error');
  }
};

// *************************
//  Get User Data (for /me)
// *************************
export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select('-password');

    if (!user) return res.status(404).json({ msg: 'User not found' });

    res.status(200).json({ user });
  } catch (err) {
    console.error('/me Error:', err);
    res.status(500).json({ msg: 'Internal Server Error' });
  }
};

// *********************
//  Forgot Password Route
// *********************
export const forgotPassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('/forgot-password Validation errors:', errors.array());
    return res.status(400).json({ errors: errors.array() });
  }

  const { email } = req.body;
  console.log(`Password reset request for email: ${email}`);

  try {
    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      console.log('/forgot-password User not found');
      return res.status(200).json({ msg: 'Password reset email sent' }); // Don't reveal user existence
    }

    console.log(`User found with ID: ${user._id}`);

    // Check if user already requested password reset in the last 24 hours
    const lastReset = await PasswordReset.findOne({
      userId: user._id,
      requestedAt: { $gt: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    });
    
    if (lastReset) {
      console.log(`User already requested reset within 24 hours at: ${lastReset.requestedAt}`);
      return res.status(400).json({
        msg: 'You can only request a password reset once per day. Please try again tomorrow.',
      });
    }

    // Generate new password
    const tempPassword = generateRandomPassword();
    console.log(`Generated temporary password: ${tempPassword}`); // For debugging - remove in production

    // Hash the new password with bcrypt directly
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(tempPassword, salt);
    console.log(`Generated hashed password: ${hashedPassword}`);

    // Direct database update to bypass any middleware issues
    const result = await User.updateOne(
      { _id: user._id },
      { 
        $set: { 
          password: hashedPassword,
          isTemporaryPassword: true // Mark this password as temporary
        } 
      }
    );

    console.log(`Password update result: ${JSON.stringify(result)}`);
    
    if (result.modifiedCount !== 1) {
      console.log('Password update failed');
      return res.status(500).json({ msg: 'Failed to update password' });
    }
    
    // Create password reset record
    const resetRecord = await PasswordReset.create({
      userId: user._id,
      requestedAt: new Date(),
    });
    console.log(`Password reset record created: ${resetRecord._id}`);

    // Send email with new password
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      }
    });
    
    const mailOptions = {
      from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: 'Your Password Reset',
      html: `
        <h1>Password Reset</h1>
        <p>Your password has been reset. Here is your new temporary password:</p>
        <h2>${tempPassword}</h2>
        <p>Please login with this password. You will be required to set a new password after login.</p>
        <p>This temporary password will expire after first use.</p>
      `
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log('Password reset email sent successfully');
    } catch(mailError) {
      console.error("Error sending mail", mailError);
      return res.status(500).json({ msg: 'Error sending email' });
    }

    res.json({ msg: 'Password reset email sent' });

  } catch (err) {
    console.error('/forgot-password Error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// **********************
// Change Password Route
// **********************
export const changePassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('/change-password Validation errors:', errors.array());
    return res.status(400).json({ errors: errors.array() });
  }

  const { newPassword } = req.body;
  const userId = req.user.id;

  try {
    // Get user by ID
    const user = await User.findById(userId).select('+isTemporaryPassword');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update the password and set isTemporaryPassword to false
    const result = await User.updateOne(
      { _id: userId },
      { $set: { password: hashedPassword, isTemporaryPassword: false } }
    );

    if (result.modifiedCount !== 1) {
      return res.status(500).json({ msg: 'Failed to update password' });
    }

    // Generate a new token without the temporary flag
    const token = generateToken(userId, false);

    res.json({ 
      msg: 'Password updated successfully',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        requiresPasswordChange: false
      }
    });
  } catch (err) {
    console.error('/change-password Error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};
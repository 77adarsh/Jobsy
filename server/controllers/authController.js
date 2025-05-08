// controllers/authController.js
import User from '../models/User.js';
import PasswordReset from '../models/PasswordReset.js';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { validationResult } from 'express-validator';

// Helper function to generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '24h',
  });
};

// Password Generator Function
const generateRandomPassword = () => {
  const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
  let password = '';
  for (let i = 0; i < 4; i++) {
    password += uppercaseChars.charAt(Math.floor(Math.random() * uppercaseChars.length));
    password += lowercaseChars.charAt(Math.floor(Math.random() * lowercaseChars.length));
  }
  return password.split('').sort(() => 0.5 - Math.random()).join('');
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
  console.log('/register Request body:', { name, email, password }); // Debugging

  try {
    // Check if user exists
    let user = await User.findOne({ email });
    console.log('/register User.findOne result:', user); // Debugging
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Create new user
    user = new User({
      name,
      email,
      password, // Password will be hashed by the pre-save middleware
    });

    await user.save();
    console.log('/register User saved:', user); // Debugging

    // Generate JWT
    const token = generateToken(user._id);
    console.log('/register Generated token:', token); // Debugging

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
  console.log('/login Request body:', { email, password }); // Debugging

  try {
    // Find user by email
    const user = await User.findOne({ email });
    console.log('/login User.findOne result:', user); // Debugging

    if (!user) {
      console.log('/login User not found');
      return res.status(401).json({ msg: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    console.log('/login Password match:', isMatch); // Debugging

    if (!isMatch) {
      console.log('Password does not match');
      return res.status(401).json({ msg: 'Invalid credentials' });
    }

    // Generate JWT
    const token = generateToken(user._id);
    console.log('/login Generated token:', token); // Debugging

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
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
    console.log('/me req.user:', req.user); // Debug log

    const userId = req.user.id; // Ensure token has 'id' field
    const user = await User.findById(userId);

    if (!user) return res.status(404).json('User not found');

    const { password, ...others } = user._doc;
    res.status(200).json(others);
  } catch (err) {
    console.error('/me Error:', err);
    res.status(500).json('Internal Server Error');
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
  console.log('/forgot-password Request body:', { email }); // Debugging

  try {
    // Find user by email
    const user = await User.findOne({ email });
    console.log('/forgot-password User.findOne result:', user); // Debugging

    if (!user) {
      console.log('/forgot-password User not found (email might not exist, but we don\'t reveal that)');
      return res.status(200).json({ msg: 'Password reset email sent' }); //  Don't reveal user existence.
    }

    // Check if user already requested password reset in the last 24 hours
    const lastReset = await PasswordReset.findOne({
      userId: user._id,
      createdAt: { $gt: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    });
    console.log('/forgot-password PasswordReset.findOne result:', lastReset); // Debugging

    if (lastReset) {
      return res.status(400).json({
        msg: 'You can only request a password reset once per day. Please try again tomorrow.',
      });
    }

    // Generate new password
    const newPassword = generateRandomPassword();

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update user password in DB
    user.password = hashedPassword;
    await user.save();
    console.log('/forgot-password User password updated');

    // Create password reset record
    await PasswordReset.create({
      userId: user._id,
      requestedAt: new Date(),
    });
    console.log('/forgot-password PasswordReset record created');

    // Send email with new password
    const transporter = nodemailer.createTransport({
      // Configure your email provider here
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      }
    });
    console.log('/forgot-password nodemailer transporter created');

    const mailOptions = {
      from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: 'Your Password Reset',
      html: `
        <h1>Password Reset</h1>
        <p>Your password has been reset. Here is your new temporary password:</p>
        <h2>${newPassword}</h2>
        <p>Please login with this password and change it immediately.</p>
      `
    };
    console.log('/forgot-password mailOptions:', mailOptions);

    try{
      await transporter.sendMail(mailOptions);
      console.log('/forgot-password Email sent successfully');
    } catch(mailError){
      console.error("/forgot-password Error sending mail", mailError);
      return res.status(500).send("Error sending email"); // IMPORTANT: Handle mail sending error
    }

    res.json({ msg: 'Password reset email sent' });

  } catch (err) {
    console.error('/forgot-password Error:', err.message);
    res.status(500).send('Server error');
  }
};
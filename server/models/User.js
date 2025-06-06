import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    select: false // Don't return password by default
  },
  isTemporaryPassword: {
    type: Boolean,
    default: false,
    select: false // Don't return this by default
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  // Add CV-related fields
  cv: {
    fileName: {
      type: String,
      default: null
    },
    fileUrl: {
      type: String,
      default: null
    },
    uploadDate: {
      type: Date,
      default: null
    },
    fileSize: {
      type: Number,
      default: null
    },
    fileType: {
      type: String,
      default: null
    }
  }
}, { timestamps: true });

// Only hash password on document creation or password update
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function(enteredPassword) {
  try {
    return await bcrypt.compare(enteredPassword, this.password);
  } catch (error) {
    console.error('Error in matchPassword:', error);
    return false;
  }
};

const User = mongoose.model('user', UserSchema);
export default User;
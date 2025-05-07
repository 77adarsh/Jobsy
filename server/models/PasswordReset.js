import mongoose from "mongoose";

const PasswordResetSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  requestedAt: { //  Keep track of when the reset was requested
    type: Date,
    required: true
  }
}, { timestamps: true });

const PasswordReset = mongoose.model('passwordreset', PasswordResetSchema);
export default PasswordReset;
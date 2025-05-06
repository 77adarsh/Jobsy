import mongoose from "mongoose";

const PasswordResetSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  }
}, { timestamps: true });

const PasswordReset = mongoose.model('passwordreset', PasswordResetSchema);
export default PasswordReset;
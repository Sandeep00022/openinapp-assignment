import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  phone_number: {
    type: String,
    required: true,
    unique: true,
  },
  priority: {
    type: [Number],
    enum: [0, 1, 2],
  },
  verificationCode: String,
  verificationCodeTimeout: String,
});

const User = mongoose.model("User", userSchema);

export default User;

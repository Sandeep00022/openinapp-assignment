import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  phone_number: {
    type: String,
    required: true,
    unique: true,
  },
  priority: {
    type: Number,
    enum: [0, 1, 2, 3],
    default: null,
  },
});

const User = mongoose.model("User", userSchema);

export default User;

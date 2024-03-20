import mongoose from "mongoose";

const taskSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  due_Date: {
    type: Date,
    required: true,
  },
  priority: {
    type: Number,
    enum: [0, 1, 2, 3],
    default: 3,
  },
});

const Task = mongoose.model("Task", taskSchema);

export default Task;

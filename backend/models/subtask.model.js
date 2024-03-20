import mongoose from "mongoose";
import mongoose from "mongoose";

const subTaskSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: true,
    },
    status: {
      type: Number,
      enum: [0, 1],
      default: 0,
    },
    updated_at: {
      type: Date,
      default: null,
    },
    deleted_at: {
      type: Date,
      default: null,
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Subtask = mongoose.model("Subtask", subTaskSchema);

export default Subtask;

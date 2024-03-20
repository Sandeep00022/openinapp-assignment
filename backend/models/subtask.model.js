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
    task_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: true,
    },
   
    updated_at: {
      type: Date,
      default: null,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    deleted_at: {
      type: Date,
      default: null,
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
    deleted: {
        type: Boolean,
        default: false  
      }
  }
);

const Subtask = mongoose.model("Subtask", subTaskSchema);

export default Subtask;

import Subtask from "../models/subtask.model.js";
import { errorHandler } from "../utils/error.js";

//create sub tasks
export const createSubTask = async (req, res, next) => {
  const { id } = req.user;
  const { task_id, title, description, status, user } = req.body;

  if (!id || !task_id) {
    return next(errorHandler(401, "unauthorized"));
  }

  const existingSubTask = await Subtask.findOne({ title });
  if (existingSubTask) {
    return next(errorHandler(400, "Subtask already exists"));
  }

  try {
    const subtask = await Subtask({
      task_id,
      title,
      description,
      status,
      user,
    });
    await subtask.save();
    res.status(200).json({
      status: "success",
      message: "Subtask created successfully",
    });
  } catch (error) {
    next(error);
  }
};

// get sub tasks
export const getSubTasks = async (req, res, next) => {
  try {
    const userId = req.user.id;
    console.log(userId);
    const subtasks = await Subtask.find({ user: userId });
    if (!subtasks) {
      return next(errorHandler(404, "No such user exists"));
    }
    res.status(200).json({
      status: "success",
      message: "Subtasks fetched successfully",
      data: subtasks,
    });
  } catch (error) {
    next(error);
  }
};

// update subTask
export const updateSubtask = async (req, res, next) => {
  const { id } = req.user;
  const { subtask_id } = req.params;
  const { user } = req.body;
  if (id !== user) {
    return next(errorHandler(401, "unauthorized"));
  }

  try {
    const updateSubTask = await Subtask.findByIdAndUpdate(
      subtask_id,
      { ...req.body, updated_at: new Date() },
      {
        new: true,
      }
    );
    res.status(200).json({
      status: "success",
      message: "Subtask updated successfully",
      data: updateSubTask,
    });
  } catch (error) {
    next(error);
  }
};

// delete sub tasks
export const deleteSubTask = async (req, res, next) => {
  const { id } = req.user;
  const { subtask_id, user_id } = req.params;

  if (id !== user_id) {
    return next(errorHandler(401, "unauthorized"));
  }

  const deletedSubTask = await Subtask.findByIdAndUpdate(
    subtask_id,
    { deleted: true, deleted_at: new Date() },
    { new: true }
  );

  if (!deletedSubTask) {
    return next(errorHandler(400, "Subtask not found"));
  }

  res.status(200).json({
    status: "success",
    message: "Subtask deleted successfully",
    data: deletedSubTask,
  });
};

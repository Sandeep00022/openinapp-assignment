import Task from "../models/task.model.js";
import { checkDueDate } from "../utils/dueDateChecker.js";
import { errorHandler } from "../utils/error.js";
import { getDueDateNumber } from "../utils/getDueDateNumber.js";

export const createTask = async (req, res, next) => {
  const { id } = req.user;
  const { title, user, due_Date } = req.body;

  if (id !== user) {
    return next(errorHandler(401, "unauthorized"));
  }

  if (!title || !due_Date || !due_Date) {
    return next(errorHandler(400, "all fields are required"));
  }

  if (!checkDueDate(due_Date)) {
    return next(errorHandler(400, "please select a upcoming date"));
  }
  try {
    const priority = getDueDateNumber(due_Date);

    const task = await Task.create({
      title,
      user,
      due_Date,
      priority,
    });

    task.save();

    res.status(201).json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

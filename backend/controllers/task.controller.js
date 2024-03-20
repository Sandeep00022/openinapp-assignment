import Task from "../models/task.model.js";
import { checkDueDate } from "../utils/dueDateChecker.js";
import { errorHandler } from "../utils/error.js";
import { getDueDateNumber } from "../utils/getDueDateNumber.js";
import cron from "node-cron";

// create task
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
    let priority = getDueDateNumber(due_Date);

    if (priority > 3) {
      priority = 3;
    }

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

// delete tasks
export const deleteTask = async (req, res, next) => {
  const { id } = req.user;
  const { user_id, task_id } = req.params;

  if (id !== user_id) {
    return next(errorHandler(401, "unauthorized"));
  }
  try {
    const task = await Task.findById(task_id);
    if (!task) {
      return next(errorHandler(404, "task not found"));
    }
    task.deleted = true;
    await task.save();
    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

// update task

export const updateTask = async (req, res, next) => {
  const { id } = req.user;
  const { user_id, task_id } = req.params;
  const { status, due_Date } = req.body;

  if (id !== user_id) {
    return next(errorHandler(401, "unauthorized"));
  }

  try {
    const task = await Task.findById(task_id);
    if (!task) {
      return next(errorHandler(404, "task not found"));
    }

    if (!due_Date) {
      task.due_Date = task.due_Date;
      task.status = status;
    } else if (!status) {
      task.status = task.status;
      task.due_Date = due_Date;
    } else {
      task.due_Date = due_Date;
      task.status = status;
    }

    await task.save();
    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
};


//updating priority of task using cron logic
cron.schedule("0 0 * * *", async (req, res, next) => {
  try {
    const tasks = await Task.find();

    for (let i = 0; i < tasks.length; i++) {
      tasks[i].priority = getDueDateNumber(tasks[i].due_Date);
      tasks[i].save();
    }
  } catch (error) {
    next(error);
  }
});


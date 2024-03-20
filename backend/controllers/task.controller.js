import Task from "../models/task.model.js";
import User from "../models/user.model.js";
import { checkDueDate } from "../utils/dueDateChecker.js";
import { errorHandler } from "../utils/error.js";
import { getDueDateNumber } from "../utils/getDueDateNumber.js";
import cron from "node-cron";
import twilio from "twilio";

const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.TWILIO_TOKEN;
const client = twilio(accountSid, authToken);

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

    const taskPresent = await Task.findOne({ title });
    if (taskPresent) {
      return next(errorHandler(400, "Task already exists"));
    }

    const task = await Task.create({
      title,
      user,
      due_Date,
    });

    await User.findByIdAndUpdate(user, { priority });

    task.save();

    res.status(201).json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

// get All tasks

export const getAllTasks = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const filterData = { user: userId };

    if (req.query.status) {
      filterData.status = req.query.status;
    }

    if (req.query.due_Date) {
      filterData.due_Date = req.query.due_Date;
    }

    //pagination

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const tasks = await Task.find(filterData).skip(skip).limit(limit);
    const count = await Task.countDocuments(filterData);

    res.status(200).json({
      success: true,
      data: { tasks, count },
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
    const Users = await User.find();

    for (let i = 0; i < Users.length; i++) {
      if (Users[i].priority >= 1) {
        User[i].priority = User[i].priority - 1;
        User[i].save();
      }
    }
  } catch (error) {
    next(error);
  }
});

// making call based on priority
cron.schedule("30 9 * * *", async (req, res, next) => {
  try {
    let tasks = await Task.find().populate("user");
    console.log(tasks);
    tasks = tasks.sort((a, b) => {
      a.user.priority > b.user.priority;
    });

    for (let i = 0; i < tasks.length; i++) {
      if (tasks[i].user.priority <= 3) {
        console.log("kar diya call");
        client.calls
          .create({
            twiml:
              "<Response><Say>Your deadline is near please complete your task as soon as possible</Say></Response>",
            to: `+91${tasks[i].user.phone_number}`,
            from: process.env.MY_NUMBER,
          })
          .then((call) => {
            console.log(call.sid);
            console.log("status", call.status);
          });
      }
    }
  } catch (error) {
    console.error("Error making call:", error);
  }
});

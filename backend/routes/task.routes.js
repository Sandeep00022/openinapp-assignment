import express from "express";

import { verifyUserTokne } from "../utils/verifyUser.js";
import {
  createTask,
  deleteTask,
  updateTask,
} from "../controllers/task.controller.js";

const router = express.Router();

router.post("/create-task", verifyUserTokne, createTask);
router.patch("/delete-task/:user_id/:task_id", verifyUserTokne, deleteTask);
router.patch("/update-task/:user_id/:task_id", verifyUserTokne, updateTask);

export default router;

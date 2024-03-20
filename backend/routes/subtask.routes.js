import express from "express";

import { verifyUserTokne } from "../utils/verifyUser.js";
import {
  createSubTask,
  deleteSubTask,
  getSubTasks,
  updateSubtask,
} from "../controllers/subtask.controller.js";

const router = express.Router();

router.post("/create-subtask", verifyUserTokne, createSubTask);
router.get("/all-subtask", verifyUserTokne, getSubTasks);
router.put("/update-subtask/:subtask_id", verifyUserTokne, updateSubtask);
router.patch(
  "/delete-subtask/:user_id/:subtask_id",
  verifyUserTokne,
  deleteSubTask
);

export default router;

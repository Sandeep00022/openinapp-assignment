import express from "express";

import { verifyUserTokne } from "../utils/verifyUser.js";
import { createTask } from "../controllers/task.controller.js";

const router = express.Router();

router.post("/create-task", verifyUserTokne, createTask);

export default router;

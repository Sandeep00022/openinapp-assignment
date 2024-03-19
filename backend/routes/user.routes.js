import express from 'express';
import { verifyCode } from '../controllers/user.controllers.js';

const router = express.Router();

router.post('/verify-code', verifyCode)


export default router;
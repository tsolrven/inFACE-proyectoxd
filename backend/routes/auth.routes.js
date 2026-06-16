import express from 'express';
import {
  register,
  login_controller,
  refresh,
  logout,
} from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login_controller);
router.post('/refresh', refresh);
router.post('/logout', logout);

export default router;

import express from 'express';
import { listar, detalle, crear } from '../controllers/apunte.controller.js';
import { autenticar } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/', listar);
router.get('/:id', detalle);
router.post('/', autenticar, crear);

export default router;

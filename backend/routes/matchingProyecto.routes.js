import express from 'express';
import {
    crear,
    listar,
    obtenerUno,
    actualizar,
    eliminar,
    postular,
    listarPostulaciones,
    responderPostulacionController,
    listarIntegrantes,
    expulsar,
    favorito,
    listarFavoritos,
} from '../controllers/matchingProyecto.controller.js';
import { autenticar, autorizar } from '../middlewares/auth.middleware.js';

const router = express.Router();

//──────────────────────────────────────────────────────────────────────────────
// PROYECTOS
//──────────────────────────────────────────────────────────────────────────────

router.get('/', autenticar, listar); // GET  /api/proyecto
router.get('/favoritos', autenticar, listarFavoritos); // GET  /api/proyecto/favoritos
router.get('/:id', autenticar, obtenerUno); // GET  /api/proyecto/:id
router.post('/', autenticar, crear); // POST /api/proyecto
router.put('/:id', autenticar, actualizar); // PUT  /api/proyecto/:id
router.delete('/:id', autenticar, eliminar); // DEL  /api/proyecto/:id

//──────────────────────────────────────────────────────────────────────────────
// POSTULACIONES
//──────────────────────────────────────────────────────────────────────────────

router.post('/:id/postular', autenticar, postular); // POST /api/proyecto/:id/postular
router.get('/:id/postulaciones', autenticar, listarPostulaciones); // GET  /api/proyecto/:id/postulaciones
router.patch('/:id/postulaciones/:postulacion_id', autenticar, responderPostulacionController); // PATCH /api/proyecto/:id/postulaciones/:postulacion_id

//──────────────────────────────────────────────────────────────────────────────
// INTEGRANTES
//──────────────────────────────────────────────────────────────────────────────

router.get('/:id/integrantes', autenticar, listarIntegrantes); // GET  /api/proyecto/:id/integrantes
router.delete('/:id/integrantes/:usuario_id', autenticar, expulsar); // DEL  /api/proyecto/:id/integrantes/:usuario_id

//──────────────────────────────────────────────────────────────────────────────
// FAVORITOS
//──────────────────────────────────────────────────────────────────────────────

router.post('/:id/favorito', autenticar, favorito); // POST /api/proyecto/:id/favorito

export default router;
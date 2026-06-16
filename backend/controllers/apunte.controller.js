import {
  listarApuntes,
  obtenerApunte,
  crearApunte,
} from '../services/apunte.service.js';

async function listar(req, res) {
  try {
    const { ramo_id, tipo, orden, pagina, limite } = req.query;
    const resultado = await listarApuntes({
      ramo_id,
      tipo,
      orden,
      pagina: pagina ? parseInt(pagina) : 1,
      limite: limite ? parseInt(limite) : 20,
    });
    res.json({ ok: true, ...resultado });
  } catch (err) {
    res
      .status(err.status || 500)
      .json({ ok: false, mensaje: err.mensaje || 'Error interno' });
  }
}

async function detalle(req, res) {
  try {
    const apunte = await obtenerApunte(req.params.id);
    res.json({ ok: true, data: apunte });
  } catch (err) {
    res
      .status(err.status || 500)
      .json({ ok: false, mensaje: err.mensaje || 'Error interno' });
  }
}

async function crear(req, res) {
  try {
    const apunte = await crearApunte({ autor_id: req.usuario.id, ...req.body });
    res.status(201).json({ ok: true, data: apunte });
  } catch (err) {
    res
      .status(err.status || 500)
      .json({ ok: false, mensaje: err.mensaje || 'Error interno' });
  }
}

export { listar, detalle, crear };

import {
  listarComentarios,
  crearComentario,
} from '../services/comentario.service.js';

async function listar(req, res) {
  try {
    const comentarios = await listarComentarios(req.params.apunte_id);
    res.json({ ok: true, data: comentarios });
  } catch (err) {
    res
      .status(err.status || 500)
      .json({ ok: false, mensaje: err.mensaje || 'Error interno' });
  }
}

async function crear(req, res) {
  try {
    const { contenido, padre_id } = req.body;
    if (!contenido || contenido.trim() === '') {
      return res
        .status(400)
        .json({ ok: false, mensaje: 'El contenido no puede estar vacío' });
    }

    const comentario = await crearComentario({
      autor_id: req.usuario.id,
      apunte_id: req.params.apunte_id,
      contenido,
      padre_id,
    });

    res.status(201).json({ ok: true, data: comentario });
  } catch (err) {
    res
      .status(err.status || 500)
      .json({ ok: false, mensaje: err.mensaje || 'Error interno' });
  }
}

export { listar, crear };

import { votar } from '../services/voto.service.js';

async function votarApunte(req, res) {
  try {
    const { tipo } = req.body; // up | down
    if (!['up', 'down'].includes(tipo)) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Tipo de voto inválido, debe ser "up" o "down"',
      });
    }

    const resultado = await votar({
      usuario_id: req.usuario.id,
      contenido_id: req.params.apunte_id,
      tipo_contenido: 'apunte',
      tipo,
    });

    res.json({ ok: true, ...resultado });
  } catch (err) {
    res
      .status(err.status || 500)
      .json({ ok: false, mensaje: err.mensaje || 'Error interno' });
  }
}

async function votarComentario(req, res) {
  try {
    const { tipo } = req.body;
    if (!['up', 'down'].includes(tipo)) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Tipo de voto inválido, debe ser "up" o "down"',
      });
    }

    const resultado = await votar({
      usuario_id: req.usuario.id,
      contenido_id: req.params.comentario_id,
      tipo_contenido: 'comentario',
      tipo,
    });

    res.json({ ok: true, ...resultado });
  } catch (err) {
    res
      .status(err.status || 500)
      .json({ ok: false, mensaje: err.mensaje || 'Error interno' });
  }
}

export { votarApunte, votarComentario };

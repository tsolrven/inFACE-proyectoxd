import { subirArchivo, eliminarArchivo } from '../services/archivo.service.js';

async function subir(req, res) {
  try {
    if (!req.file) throw { status: 400, mensaje: 'No se envió ningún archivo' };
    const archivo = await subirArchivo({
      apunte_id: req.params.apunte_id,
      file: req.file,
    });
    res.status(201).json({ ok: true, data: archivo });
  } catch (err) {
    res.status(err.status || 500).json({
      ok: false,
      mensaje: err.mensaje || err.message || 'Error interno',
    });
  }
}

async function eliminar(req, res) {
  try {
    const resultado = await eliminarArchivo(req.params.id);
    res.json({ ok: true, ...resultado });
  } catch (err) {
    res
      .status(err.status || 500)
      .json({ ok: false, mensaje: err.mensaje || 'Error interno' });
  }
}

export { subir, eliminar };

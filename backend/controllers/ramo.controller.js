import {
  listarRamosPorCarrera,
  getCarreras,
} from '../services/ramo.service.js';

async function listarCarreras(req, res) {
  try {
    const carreras = await getCarreras();
    res.json({ ok: true, data: carreras });
  } catch (err) {
    res.status(500).json({ ok: false, mensaje: 'Error interno' });
  }
}

async function listarRamos(req, res) {
  try {
    const { carrera_id } = req.params;
    const ramos = await listarRamosPorCarrera(carrera_id);
    res.json({ ok: true, data: ramos });
  } catch (err) {
    res.status(500).json({ ok: false, mensaje: 'Error interno' });
  }
}

export { listarCarreras, listarRamos };

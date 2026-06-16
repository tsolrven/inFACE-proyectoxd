//* service para manejar archivos relacionados con apuntes

import path from 'path';
import fs from 'fs';
import { prisma } from '../config/configDb.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function subirArchivo({ apunte_id, file }) {
  const apunte = await prisma.apunte.findUnique({ where: { id: apunte_id } });
  if (!apunte) throw { status: 404, mensaje: 'Apunte no encontrado' };

  const archivo = await prisma.archivo.create({
    data: {
      tipo_contenido: 'apunte',
      contenido_id: apunte_id,
      nombre_archivo: file.originalname,
      ruta_url: `/uploads/${file.filename}`,
      tipo_mime: file.mimetype,
      tamanio: file.size,
    },
  });

  return archivo;
}

async function eliminarArchivo(id) {
  const archivo = await prisma.archivo.findUnique({ where: { id } });
  if (!archivo) throw { status: 404, mensaje: 'Archivo no encontrado' };

  const rutaFisica = path.join(__dirname, '..', archivo.ruta_url);
  if (fs.existsSync(rutaFisica)) fs.unlinkSync(rutaFisica);

  await prisma.archivo.delete({ where: { id } });
  return { mensaje: 'Archivo eliminado' };
}

export { subirArchivo, eliminarArchivo };

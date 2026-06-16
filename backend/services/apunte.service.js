import { prisma } from '../config/configDb.js';

async function listarApuntes({
  ramo_id,
  tipo,
  orden = 'recientes',
  pagina = 1,
  limite = 20,
}) {
  const where = {};
  if (ramo_id) where.ramo_id = ramo_id;
  if (tipo) where.tipo = tipo;

  const orderBy =
    orden === 'populares' ? { votos_neto: 'desc' } : { creado_en: 'desc' };

  const [apuntes, total] = await Promise.all([
    prisma.apunte.findMany({
      where,
      orderBy,
      skip: (pagina - 1) * limite,
      take: limite,
      include: {
        autor: { include: { perfil: { select: { nombre_usuario: true } } } },
        ramo: {
          select: { id: true, nombre: true, codigo: true, semestre: true },
        },
        hashtags: { include: { hashtag: { select: { nombre: true } } } },
        _count: { select: { hashtags: true } },
      },
    }),
    prisma.apunte.count({ where }),
  ]);

  return {
    datos: apuntes.map(formatearApunte),
    total,
    pagina,
    paginas: Math.ceil(total / limite),
  };
}

async function obtenerApunte(id) {
  const apunte = await prisma.apunte.findUnique({
    where: { id },
    include: {
      autor: { include: { perfil: { select: { nombre_usuario: true } } } },
      ramo: {
        select: { id: true, nombre: true, codigo: true, semestre: true },
      },
      hashtags: { include: { hashtag: { select: { nombre: true } } } },
    },
  });

  if (!apunte) throw { status: 404, mensaje: 'Apunte no encontrado' };

  const archivos = await prisma.archivo.findMany({
    where: { tipo_contenido: 'apunte', contenido_id: id },
  });

  return { ...formatearApunte(apunte), archivos };
}

async function crearApunte({
  autor_id,
  ramo_id,
  titulo,
  descripcion,
  tipo,
  link_repositorio,
  codigo_snippet,
  hashtags = [],
}) {
  if (link_repositorio && codigo_snippet) {
    throw { status: 400, mensaje: 'No puedes enviar link y snippet a la vez' };
  }

  const ramo = await prisma.ramo.findUnique({ where: { id: ramo_id } });
  if (!ramo) throw { status: 404, mensaje: 'Ramo no encontrado' };

  const apunte = await prisma.apunte.create({
    data: {
      autor_id,
      ramo_id,
      titulo,
      descripcion,
      tipo: tipo || 'apunte',
      link_repositorio,
      codigo_snippet,
      hashtags: {
        create: await Promise.all(
          hashtags.map(async (nombre) => {
            const tag = await prisma.hashtag.upsert({
              where: { nombre },
              update: {},
              create: { nombre },
            });
            return { hashtag_id: tag.id };
          }),
        ),
      },
    },
    include: {
      autor: { include: { perfil: { select: { nombre_usuario: true } } } },
      ramo: {
        select: { id: true, nombre: true, codigo: true, semestre: true },
      },
      hashtags: { include: { hashtag: { select: { nombre: true } } } },
    },
  });

  return formatearApunte(apunte);
}

function formatearApunte(apunte) {
  return {
    id: apunte.id,
    titulo: apunte.titulo,
    descripcion: apunte.descripcion,
    tipo: apunte.tipo,
    votos_neto: apunte.votos_neto,
    link_repositorio: apunte.link_repositorio,
    codigo_snippet: apunte.codigo_snippet,
    creado_en: apunte.creado_en,
    actualizado_en: apunte.actualizado_en,
    autor: {
      id: apunte.autor.id,
      nombre_usuario: apunte.autor.perfil?.nombre_usuario,
    },
    ramo: apunte.ramo,
    hashtags: apunte.hashtags.map((h) => h.hashtag.nombre),
  };
}

export { listarApuntes, obtenerApunte, crearApunte };

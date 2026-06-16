import { prisma } from '../config/configDb.js';

//──────────────────────────────────────────────────────────────────────────────
// PROYECTOS
//──────────────────────────────────────────────────────────────────────────────

async function crearProyecto({ creador_id, titulo_proyecto, descripcion_proyecto, modalidad_proyecto, maximo_integrantes, fecha_inicio, fecha_fin, etiqueta_ids = [] }) {
    const proyecto = await prisma.proyecto.create({
        data: {
            creador_id,
            titulo_proyecto,
            descripcion_proyecto,
            modalidad_proyecto,
            maximo_integrantes,
            fecha_inicio: fecha_inicio ? new Date(fecha_inicio) : null,
            fecha_fin: fecha_fin ? new Date(fecha_fin) : null,
            etiquetas: {
                create: etiqueta_ids.map(id => ({ etiqueta_id: id })),
            },
        },
        include: _incluirProyectoCompleto(),
    });

    return _formatearProyecto(proyecto);
}

// ╰─────────────────────────────✧────────────────────────────────╮

async function obtenerProyectos({ modalidad, estado, etiqueta_ids = [], pagina = 1, limite = 10 }) {
    const skip = (pagina - 1) * limite;

    const where = {
        ...(modalidad && { modalidad_proyecto: modalidad }),
        ...(estado && { estado_proyecto: estado }),
        ...(etiqueta_ids.length > 0 && {
            etiquetas: {
                some: { etiqueta_id: { in: etiqueta_ids.map(Number) } },
            },
        }),
    };

    const [proyectos, total] = await Promise.all([
        prisma.proyecto.findMany({
            where,
            skip,
            take: limite,
            orderBy: { fecha_creacion: 'desc' },
            include: _incluirProyectoCompleto(),
        }),
        prisma.proyecto.count({ where }),
    ]);

    return {
        datos: proyectos.map(_formatearProyecto),
        total,
        pagina,
        total_paginas: Math.ceil(total / limite),
    };
}

// ╰─────────────────────────────✧────────────────────────────────╮

async function obtenerProyectoPorId(id) {
    const proyecto = await prisma.proyecto.findUnique({
        where: { id },
        include: _incluirProyectoCompleto(),
    });

    if (!proyecto) throw { status: 404, mensaje: 'Proyecto no encontrado' };

    return _formatearProyecto(proyecto);
}

// ╰─────────────────────────────✧────────────────────────────────╮

async function actualizarProyecto(id, usuario_id, rol, datos) {
    const proyecto = await prisma.proyecto.findUnique({ where: { id } });

    if (!proyecto) throw { status: 404, mensaje: 'Proyecto no encontrado' };
    if (proyecto.creador_id !== usuario_id && rol !== 'superadmin')
        throw { status: 403, mensaje: 'No tienes permiso para editar este proyecto' };

    const { etiqueta_ids, fecha_inicio, fecha_fin, ...resto } = datos;

    const actualizado = await prisma.proyecto.update({
        where: { id },
        data: {
            ...resto,
            ...(fecha_inicio && { fecha_inicio: new Date(fecha_inicio) }),
            ...(fecha_fin && { fecha_fin: new Date(fecha_fin) }),
            ...(etiqueta_ids && {
                etiquetas: {
                    deleteMany: {},
                    create: etiqueta_ids.map(id => ({ etiqueta_id: id })),
                },
            }),
        },
        include: _incluirProyectoCompleto(),
    });

    return _formatearProyecto(actualizado);
}

// ╰─────────────────────────────✧────────────────────────────────╮

async function eliminarProyecto(id, usuario_id, rol) {
    const proyecto = await prisma.proyecto.findUnique({ where: { id } });

    if (!proyecto) throw { status: 404, mensaje: 'Proyecto no encontrado' };
    if (proyecto.creador_id !== usuario_id && rol !== 'superadmin')
        throw { status: 403, mensaje: 'No tienes permiso para eliminar este proyecto' };

    await prisma.proyecto.delete({ where: { id } });

    return { mensaje: 'Proyecto eliminado correctamente' };
}

//──────────────────────────────────────────────────────────────────────────────
// POSTULACIONES
//──────────────────────────────────────────────────────────────────────────────

async function postularProyecto({ proyecto_id, postulante_id, mensaje_postulacion }) {
    const proyecto = await prisma.proyecto.findUnique({ where: { id: proyecto_id } });

    if (!proyecto) throw { status: 404, mensaje: 'Proyecto no encontrado' };
    if (proyecto.estado_proyecto !== 'abierto')
        throw { status: 400, mensaje: 'El proyecto no está aceptando postulaciones' };
    if (proyecto.creador_id === postulante_id)
        throw { status: 400, mensaje: 'No puedes postularte a tu propio proyecto' };

    const yaPostulado = await prisma.postulacionProyecto.findFirst({
        where: { proyecto_id, postulante_id },
    });
    if (yaPostulado) throw { status: 400, mensaje: 'Ya postulaste a este proyecto' };

    const yaIntegrante = await prisma.integranteProyecto.findFirst({
        where: { proyecto_id, usuario_id: postulante_id },
    });
    if (yaIntegrante) throw { status: 400, mensaje: 'Ya eres integrante de este proyecto' };

    const postulacion = await prisma.postulacionProyecto.create({
        data: { proyecto_id, postulante_id, mensaje_postulacion },
        include: {
            postulante: { include: { perfil: true } },
            proyecto: { select: { titulo_proyecto: true } },
        },
    });

    return _formatearPostulacion(postulacion);
}

// ╰─────────────────────────────✧────────────────────────────────╮

async function obtenerPostulacionesProyecto(proyecto_id, usuario_id, rol) {
    const proyecto = await prisma.proyecto.findUnique({ where: { id: proyecto_id } });

    if (!proyecto) throw { status: 404, mensaje: 'Proyecto no encontrado' };
    if (proyecto.creador_id !== usuario_id && rol !== 'superadmin')
        throw { status: 403, mensaje: 'No tienes permiso para ver estas postulaciones' };

    const postulaciones = await prisma.postulacionProyecto.findMany({
        where: { proyecto_id },
        include: {
            postulante: { include: { perfil: true } },
        },
        orderBy: { fecha_postulacion: 'desc' },
    });

    return postulaciones.map(_formatearPostulacion);
}

// ╰─────────────────────────────✧────────────────────────────────╮

async function responderPostulacion(postulacion_id, usuario_id, rol, estado) {
    const postulacion = await prisma.postulacionProyecto.findUnique({
        where: { id: postulacion_id },
        include: { proyecto: true },
    });

    if (!postulacion) throw { status: 404, mensaje: 'Postulación no encontrada' };
    if (postulacion.proyecto.creador_id !== usuario_id && rol !== 'superadmin')
        throw { status: 403, mensaje: 'No tienes permiso para responder esta postulación' };
    if (postulacion.estado_postulacion !== 'pendiente')
        throw { status: 400, mensaje: 'Esta postulación ya fue respondida' };
    if (!['aceptada', 'rechazada'].includes(estado))
        throw { status: 400, mensaje: 'Estado inválido' };

    const actualizada = await prisma.postulacionProyecto.update({
        where: { id: postulacion_id },
        data: { estado_postulacion: estado },
    });

    // si es aceptada, agregar como integrante
    if (estado === 'aceptada') {
        await prisma.integranteProyecto.create({
            data: {
                proyecto_id: postulacion.proyecto_id,
                usuario_id: postulacion.postulante_id,
            },
        });

        // verificar si se alcanzó el máximo de integrantes
        if (postulacion.proyecto.maximo_integrantes) {
            const totalIntegrantes = await prisma.integranteProyecto.count({
                where: { proyecto_id: postulacion.proyecto_id },
            });

            if (totalIntegrantes >= postulacion.proyecto.maximo_integrantes) {
                await prisma.proyecto.update({
                    where: { id: postulacion.proyecto_id },
                    data: { estado_proyecto: 'en_progreso' },
                });
            }
        }
    }

    return _formatearPostulacion(actualizada);
}

//──────────────────────────────────────────────────────────────────────────────
// INTEGRANTES
//──────────────────────────────────────────────────────────────────────────────

async function obtenerIntegrantes(proyecto_id) {
    const proyecto = await prisma.proyecto.findUnique({ where: { id: proyecto_id } });
    if (!proyecto) throw { status: 404, mensaje: 'Proyecto no encontrado' };

    const integrantes = await prisma.integranteProyecto.findMany({
        where: { proyecto_id },
        include: { usuario: { include: { perfil: true } } },
        orderBy: { fecha_union: 'asc' },
    });

    return integrantes.map(i => ({
        usuario_id: i.usuario_id,
        nombre_usuario: i.usuario.perfil?.nombre_usuario,
        nombre_completo: i.usuario.perfil?.nombre_completo,
        rol_en_proyecto: i.rol_en_proyecto,
        fecha_union: i.fecha_union,
    }));
}

// ╰─────────────────────────────✧────────────────────────────────╮

async function expulsarIntegrante(proyecto_id, usuario_id_expulsar, usuario_id, rol) {
    const proyecto = await prisma.proyecto.findUnique({ where: { id: proyecto_id } });

    if (!proyecto) throw { status: 404, mensaje: 'Proyecto no encontrado' };
    if (proyecto.creador_id !== usuario_id && rol !== 'superadmin')
        throw { status: 403, mensaje: 'No tienes permiso para expulsar integrantes' };
    if (usuario_id_expulsar === proyecto.creador_id)
        throw { status: 400, mensaje: 'No puedes expulsar al creador del proyecto' };

    const integrante = await prisma.integranteProyecto.findFirst({
        where: { proyecto_id, usuario_id: usuario_id_expulsar },
    });
    if (!integrante) throw { status: 404, mensaje: 'El usuario no es integrante de este proyecto' };

    await prisma.integranteProyecto.delete({ where: { id: integrante.id } });

    return { mensaje: 'Integrante eliminado correctamente' };
}

//──────────────────────────────────────────────────────────────────────────────
// FAVORITOS
//──────────────────────────────────────────────────────────────────────────────

async function toggleFavorito(usuario_id, proyecto_id) {
    const existe = await prisma.favoritoProyecto.findUnique({
        where: { usuario_id_proyecto_id: { usuario_id, proyecto_id } },
    });

    if (existe) {
        await prisma.favoritoProyecto.delete({
            where: { usuario_id_proyecto_id: { usuario_id, proyecto_id } },
        });
        return { guardado: false, mensaje: 'Proyecto eliminado de favoritos' };
    }

    await prisma.favoritoProyecto.create({ data: { usuario_id, proyecto_id } });
    return { guardado: true, mensaje: 'Proyecto guardado en favoritos' };
}

// ╰─────────────────────────────✧────────────────────────────────╮

async function obtenerFavoritos(usuario_id) {
    const favoritos = await prisma.favoritoProyecto.findMany({
        where: { usuario_id },
        include: { proyecto: { include: _incluirProyectoCompleto() } },
        orderBy: { fecha_creacion: 'desc' },
    });

    return favoritos.map(f => _formatearProyecto(f.proyecto));
}

//──────────────────────────────────────────────────────────────────────────────
// HELPERS INTERNOS
//──────────────────────────────────────────────────────────────────────────────

function _incluirProyectoCompleto() {
    return {
        creador: { include: { perfil: true } },
        etiquetas: { include: { etiqueta: true } },
        integrantes: { include: { usuario: { include: { perfil: true } } } },
        _count: { select: { postulaciones: true, integrantes: true } },
    };
}

function _formatearProyecto(p) {
    return {
        id: p.id,
        titulo: p.titulo_proyecto,
        descripcion: p.descripcion_proyecto,
        modalidad: p.modalidad_proyecto,
        maximo_integrantes: p.maximo_integrantes,
        estado: p.estado_proyecto,
        fecha_inicio: p.fecha_inicio,
        fecha_fin: p.fecha_fin,
        fecha_creacion: p.fecha_creacion,
        creador: {
            id: p.creador?.id,
            nombre_usuario: p.creador?.perfil?.nombre_usuario,
            nombre_completo: p.creador?.perfil?.nombre_completo,
        },
        etiquetas: p.etiquetas?.map(e => ({
            id: e.etiqueta.id,
            nombre: e.etiqueta.nombre_etiqueta,
        })),
        integrantes: p.integrantes?.map(i => ({
            usuario_id: i.usuario_id,
            nombre_usuario: i.usuario?.perfil?.nombre_usuario,
            rol_en_proyecto: i.rol_en_proyecto,
        })),
        total_postulaciones: p._count?.postulaciones,
        total_integrantes: p._count?.integrantes,
    };
}

function _formatearPostulacion(p) {
    return {
        id: p.id,
        proyecto_id: p.proyecto_id,
        titulo_proyecto: p.proyecto?.titulo_proyecto,
        estado: p.estado_postulacion,
        mensaje: p.mensaje_postulacion,
        fecha_postulacion: p.fecha_postulacion,
        postulante: p.postulante ? {
            id: p.postulante.id,
            nombre_usuario: p.postulante.perfil?.nombre_usuario,
            nombre_completo: p.postulante.perfil?.nombre_completo,
        } : undefined,
    };
}

export {
    crearProyecto,
    obtenerProyectos,
    obtenerProyectoPorId,
    actualizarProyecto,
    eliminarProyecto,
    postularProyecto,
    obtenerPostulacionesProyecto,
    responderPostulacion,
    obtenerIntegrantes,
    expulsarIntegrante,
    toggleFavorito,
    obtenerFavoritos,
};
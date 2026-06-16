import {
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
} from '../services/matchingProyecto.service.js';

//──────────────────────────────────────────────────────────────────────────────
// PROYECTOS
//──────────────────────────────────────────────────────────────────────────────

async function crear(req, res) {
    try {
        const proyecto = await crearProyecto({
            creador_id: req.usuario.id,
            ...req.body,
        });
        res.status(201).json({ ok: true, data: proyecto });
    } catch (err) {
        res.status(err.status || 500).json({ ok: false, mensaje: err.mensaje || 'Error interno' });
    }
}

// ╰─────────────────────────────✧────────────────────────────────╮

async function listar(req, res) {
    try {
        const { modalidad, estado, etiquetas, pagina, limite } = req.query;
        const etiqueta_ids = etiquetas ? etiquetas.split(',').map(Number) : [];

        const resultado = await obtenerProyectos({
            modalidad,
            estado,
            etiqueta_ids,
            pagina: Number(pagina) || 1,
            limite: Number(limite) || 10,
        });
        res.json({ ok: true, ...resultado });
    } catch (err) {
        res.status(err.status || 500).json({ ok: false, mensaje: err.mensaje || 'Error interno' });
    }
}

// ╰─────────────────────────────✧────────────────────────────────╮

async function obtenerUno(req, res) {
    try {
        const proyecto = await obtenerProyectoPorId(Number(req.params.id));
        res.json({ ok: true, data: proyecto });
    } catch (err) {
        res.status(err.status || 500).json({ ok: false, mensaje: err.mensaje || 'Error interno' });
    }
}

// ╰─────────────────────────────✧────────────────────────────────╮

async function actualizar(req, res) {
    try {
        const proyecto = await actualizarProyecto(
            Number(req.params.id),
            req.usuario.id,
            req.usuario.rol,
            req.body,
        );
        res.json({ ok: true, data: proyecto });
    } catch (err) {
        res.status(err.status || 500).json({ ok: false, mensaje: err.mensaje || 'Error interno' });
    }
}

// ╰─────────────────────────────✧────────────────────────────────╮

async function eliminar(req, res) {
    try {
        const resultado = await eliminarProyecto(
            Number(req.params.id),
            req.usuario.id,
            req.usuario.rol,
        );
        res.json({ ok: true, ...resultado });
    } catch (err) {
        res.status(err.status || 500).json({ ok: false, mensaje: err.mensaje || 'Error interno' });
    }
}

//──────────────────────────────────────────────────────────────────────────────
// POSTULACIONES
//──────────────────────────────────────────────────────────────────────────────

async function postular(req, res) {
    try {
        const postulacion = await postularProyecto({
            proyecto_id: Number(req.params.id),
            postulante_id: req.usuario.id,
            mensaje_postulacion: req.body.mensaje_postulacion,
        });
        res.status(201).json({ ok: true, data: postulacion });
    } catch (err) {
        res.status(err.status || 500).json({ ok: false, mensaje: err.mensaje || 'Error interno' });
    }
}

// ╰─────────────────────────────✧────────────────────────────────╮

async function listarPostulaciones(req, res) {
    try {
        const postulaciones = await obtenerPostulacionesProyecto(
            Number(req.params.id),
            req.usuario.id,
            req.usuario.rol,
        );
        res.json({ ok: true, data: postulaciones });
    } catch (err) {
        res.status(err.status || 500).json({ ok: false, mensaje: err.mensaje || 'Error interno' });
    }
}

// ╰─────────────────────────────✧────────────────────────────────╮

async function responderPostulacionController(req, res) {
    try {
        const resultado = await responderPostulacion(
            Number(req.params.postulacion_id),
            req.usuario.id,
            req.usuario.rol,
            req.body.estado,
        );
        res.json({ ok: true, data: resultado });
    } catch (err) {
        res.status(err.status || 500).json({ ok: false, mensaje: err.mensaje || 'Error interno' });
    }
}

//──────────────────────────────────────────────────────────────────────────────
// INTEGRANTES
//──────────────────────────────────────────────────────────────────────────────

async function listarIntegrantes(req, res) {
    try {
        const integrantes = await obtenerIntegrantes(Number(req.params.id));
        res.json({ ok: true, data: integrantes });
    } catch (err) {
        res.status(err.status || 500).json({ ok: false, mensaje: err.mensaje || 'Error interno' });
    }
}

// ╰─────────────────────────────✧────────────────────────────────╮

async function expulsar(req, res) {
    try {
        const resultado = await expulsarIntegrante(
            Number(req.params.id),
            req.params.usuario_id,
            req.usuario.id,
            req.usuario.rol,
        );
        res.json({ ok: true, ...resultado });
    } catch (err) {
        res.status(err.status || 500).json({ ok: false, mensaje: err.mensaje || 'Error interno' });
    }
}

//──────────────────────────────────────────────────────────────────────────────
// FAVORITOS
//──────────────────────────────────────────────────────────────────────────────

async function favorito(req, res) {
    try {
        const resultado = await toggleFavorito(
            req.usuario.id,
            Number(req.params.id),
        );
        res.json({ ok: true, ...resultado });
    } catch (err) {
        res.status(err.status || 500).json({ ok: false, mensaje: err.mensaje || 'Error interno' });
    }
}

// ╰─────────────────────────────✧────────────────────────────────╮

async function listarFavoritos(req, res) {
    try {
        const favoritos = await obtenerFavoritos(req.usuario.id);
        res.json({ ok: true, data: favoritos });
    } catch (err) {
        res.status(err.status || 500).json({ ok: false, mensaje: err.mensaje || 'Error interno' });
    }
}

export {
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
};
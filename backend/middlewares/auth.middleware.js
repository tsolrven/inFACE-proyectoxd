import { verificarAccessToken } from '../helpers/jwt.helper.js';

function autenticar(req, res, next) {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res
        .status(401)
        .json({ ok: false, mensaje: 'Token no proporcionado' });
    }

    const token = authHeader.split(' ')[1];
    const payload = verificarAccessToken(token);
    req.usuario = payload;
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ ok: false, mensaje: 'Token inválido o expirado' });
  }
}

function autorizar(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.usuario?.rol)) {
      return res
        .status(403)
        .json({ ok: false, mensaje: 'No tienes permiso para esto' });
    }
    next();
  };
}

export { autenticar, autorizar };

//* se maneja la autenticación usando tokens jwt con sistema de refresh tokens almacenados en cookies

import { registrar, login, refrescarToken } from '../services/auth.service.js';

const REFRESH_COOKIE_OPTS = {
  httpOnly: true,
  sameSite: 'strict',
  secure: process.env.NODE_ENV === 'production',
  maxAge: 7 * 24 * 60 * 60 * 1000, //* duración de 7 días
};

async function register(req, res) {
  try {
    const usuario = await registrar(req.body);
    res.status(201).json({ ok: true, data: usuario });
  } catch (err) {
    res
      .status(err.status || 500)
      .json({ ok: false, mensaje: err.mensaje || 'Error interno' });
  }
}

async function login_controller(req, res) {
  try {
    const { accessToken, refreshToken, usuario } = await login(req.body);
    res.cookie('refreshToken', refreshToken, REFRESH_COOKIE_OPTS);
    res.json({ ok: true, accessToken, usuario });
  } catch (err) {
    res
      .status(err.status || 500)
      .json({ ok: false, mensaje: err.mensaje || 'Error interno' });
  }
}

async function refresh(req, res) {
  try {
    const token = req.cookies?.refreshToken;
    const { accessToken } = await refrescarToken(token);
    res.json({ ok: true, accessToken });
  } catch (err) {
    res
      .status(err.status || 500)
      .json({ ok: false, mensaje: err.mensaje || 'Error interno' });
  }
}

async function logout(req, res) {
  res.clearCookie('refreshToken');
  res.json({ ok: true, mensaje: 'Sesión cerrada' });
}

export { register, login_controller, refresh, logout };

import bcrypt from 'bcryptjs';
import { prisma } from '../config/configDb.js';
import {
  generarAccessToken,
  generarRefreshToken,
  verificarRefreshToken,
} from '../helpers/jwt.helper.js';

async function registrar({ correo, contrasena, nombre_usuario, rol }) {
  const usuarioExiste = await prisma.usuario.findUnique({ where: { correo } });
  if (usuarioExiste)
    throw { status: 400, mensaje: 'El correo ya está registrado' };

  const nombreExiste = await prisma.perfil.findUnique({
    where: { nombre_usuario },
  });
  if (nombreExiste)
    throw { status: 400, mensaje: 'El nombre de usuario ya está en uso' };

  const hash = await bcrypt.hash(contrasena, 10);

  const usuario = await prisma.usuario.create({
    data: {
      correo,
      contrasena: hash,
      rol: rol || 'estudiante',
      perfil: {
        create: { nombre_usuario },
      },
    },
    include: { perfil: true },
  });

  return {
    id: usuario.id,
    correo: usuario.correo,
    rol: usuario.rol,
    nombre_usuario: usuario.perfil.nombre_usuario,
  };
}

async function login({ correo, contrasena }) {
  const usuario = await prisma.usuario.findUnique({
    where: { correo },
    include: { perfil: true },
  });

  if (!usuario) throw { status: 401, mensaje: 'Credenciales inválidas' };
  if (!usuario.esta_activo)
    throw { status: 403, mensaje: 'Cuenta desactivada' };

  const passwordValido = await bcrypt.compare(contrasena, usuario.contrasena);
  if (!passwordValido) throw { status: 401, mensaje: 'Credenciales inválidas' };

  const payload = { id: usuario.id, rol: usuario.rol };
  const accessToken = generarAccessToken(payload);
  const refreshToken = generarRefreshToken(payload);

  return {
    accessToken,
    refreshToken,
    usuario: {
      id: usuario.id,
      correo: usuario.correo,
      rol: usuario.rol,
      nombre_usuario: usuario.perfil.nombre_usuario,
    },
  };
}

async function refrescarToken(token) {
  if (!token) throw { status: 401, mensaje: 'No hay refresh token' };

  const payload = verificarRefreshToken(token);
  const usuario = await prisma.usuario.findUnique({
    where: { id: payload.id },
  });

  if (!usuario || !usuario.esta_activo)
    throw { status: 403, mensaje: 'Usuario no válido' };

  const accessToken = generarAccessToken({ id: usuario.id, rol: usuario.rol });
  return { accessToken };
}

export { registrar, login, refrescarToken };

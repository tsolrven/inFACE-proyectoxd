import { createRequire } from 'module';
const require = createRequire(import.meta.url);
require('dotenv').config({ path: new URL('../.env', import.meta.url).pathname });

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';

const pool = new Pool({
  connectionString: 'postgresql://postgres:1421estrellas@localhost:5432/inface_bd',
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

//* CARRERAS ───────────────────────────────────────────────────────────────────────────────────────────────────────────
const carreras = [
  {
    nombre: 'Ingeniería de Ejecución en Computación e Informática',
    codigo: 'IECI',
  },
  { nombre: 'Ingeniería Civil en Informática', codigo: 'ICI' },
  { nombre: 'Derecho', codigo: 'DER' },
];

//* RAMOS ──────────────────────────────────────────────────────────────────────────────────────────────────────────────
const ramos = {
  IECI: [
    { nombre: 'Álgebra I', codigo: 'IECI-101', semestre: 1 },
    { nombre: 'Nociones de Computación e Informática', codigo: 'IECI-102', semestre: 1 },
    { nombre: 'Algoritmos y Bases de la Programación', codigo: 'IECI-103', semestre: 1 },
    { nombre: 'Introducción a la Ingeniería', codigo: 'IECI-104', semestre: 1 },
    { nombre: 'Comunicación y Argumentación', codigo: 'IECI-105', semestre: 1 },
    { nombre: 'Formación Integral Extraprogramática', codigo: 'IECI-106', semestre: 1 },
    { nombre: 'Álgebra II', codigo: 'IECI-201', semestre: 2 },
    { nombre: 'Cálculo I', codigo: 'IECI-202', semestre: 2 },
    { nombre: 'Algoritmos y Programación', codigo: 'IECI-203', semestre: 2 },
    { nombre: 'Est. Discretas para Cs. De la Computación', codigo: 'IECI-204', semestre: 2 },
    { nombre: 'Formación Integral Oferta Institucional', codigo: 'IECI-205', semestre: 2 },
    { nombre: 'Formación Integral Extraprogramática', codigo: 'IECI-206', semestre: 2 },
    { nombre: 'Estadística y Probabilidades', codigo: 'IECI-301', semestre: 3 },
    { nombre: 'Cálculo II', codigo: 'IECI-302', semestre: 3 },
    { nombre: 'Estructura de Datos', codigo: 'IECI-303', semestre: 3 },
    { nombre: 'Administración General', codigo: 'IECI-304', semestre: 3 },
    { nombre: 'Economía', codigo: 'IECI-305', semestre: 3 },
    { nombre: 'Formación Integral Extraprogramática', codigo: 'IECI-306', semestre: 3 },
    { nombre: 'Arquitectura de Computadores', codigo: 'IECI-401', semestre: 4 },
    { nombre: 'Paradigmas de la Programación', codigo: 'IECI-402', semestre: 4 },
    { nombre: 'Análisis de Algoritmo y Teoría de Autómatas', codigo: 'IECI-403', semestre: 4 },
    { nombre: 'Inglés I', codigo: 'IECI-404', semestre: 4 },
    { nombre: 'Práctica Profesional I', codigo: 'IECI-405', semestre: 4 },
    { nombre: 'Metodología de Desarrollo', codigo: 'IECI-501', semestre: 5 },
    { nombre: 'Base de Datos', codigo: 'IECI-502', semestre: 5 },
    { nombre: 'Sistemas de Información', codigo: 'IECI-503', semestre: 5 },
    { nombre: 'Sistemas Financieros y Contables', codigo: 'IECI-504', semestre: 5 },
    { nombre: 'Inglés II', codigo: 'IECI-505', semestre: 5 },
    { nombre: 'Formación Integral Oferta Institucional', codigo: 'IECI-506', semestre: 5 },
    { nombre: 'Inteligencia Artificial', codigo: 'IECI-601', semestre: 6 },
    { nombre: 'Sistemas Operativos', codigo: 'IECI-602', semestre: 6 },
    { nombre: 'Ingeniería de Software', codigo: 'IECI-603', semestre: 6 },
    { nombre: 'Formulación y Evaluación de Proyectos', codigo: 'IECI-604', semestre: 6 },
    { nombre: 'Inglés III', codigo: 'IECI-605', semestre: 6 },
    { nombre: 'Electivo de Especialidad I', codigo: 'IECI-606', semestre: 6 },
    { nombre: 'Electivo de Especialidad II', codigo: 'IECI-701', semestre: 7 },
    { nombre: 'Comunicación de Datos y Redes', codigo: 'IECI-702', semestre: 7 },
    { nombre: 'Taller de Desarrollo', codigo: 'IECI-703', semestre: 7 },
    { nombre: 'Gestión Empresarial', codigo: 'IECI-704', semestre: 7 },
    { nombre: 'Inglés IV', codigo: 'IECI-705', semestre: 7 },
    { nombre: 'Práctica Profesional II', codigo: 'IECI-706', semestre: 7 },
    { nombre: 'Electivo de Especialidad III', codigo: 'IECI-801', semestre: 8 },
    { nombre: 'Formación Integral Oferta Institucional', codigo: 'IECI-802', semestre: 8 },
    { nombre: 'Proyecto Final de Carrera', codigo: 'IECI-803', semestre: 8 },
    { nombre: 'Formación Integral Extraprogramática', codigo: 'IECI-804', semestre: 8 },
  ],
  ICI: [
    { nombre: 'Álgebra y Trigonometría', codigo: 'ICI-101', semestre: 1 },
    { nombre: 'Introducción a la Ingeniería', codigo: 'ICI-102', semestre: 1 },
    { nombre: 'Comunicación Oral y Escrita', codigo: 'ICI-103', semestre: 1 },
    { nombre: 'Introducción a la Programación', codigo: 'ICI-104', semestre: 1 },
    { nombre: 'Formación Integral Oferta Institucional', codigo: 'ICI-105', semestre: 1 },
    { nombre: 'Cálculo Diferencial', codigo: 'ICI-201', semestre: 2 },
    { nombre: 'Química General', codigo: 'ICI-202', semestre: 2 },
    { nombre: 'Estructuras Discretas para Cs. de la Comp.', codigo: 'ICI-203', semestre: 2 },
    { nombre: 'Programación Orientada a Objeto', codigo: 'ICI-204', semestre: 2 },
    { nombre: 'Formación Integral Oferta Institucional', codigo: 'ICI-205', semestre: 2 },
    { nombre: 'Cálculo Integral', codigo: 'ICI-301', semestre: 3 },
    { nombre: 'Álgebra Lineal', codigo: 'ICI-302', semestre: 3 },
    { nombre: 'Física Newtoniana', codigo: 'ICI-303', semestre: 3 },
    { nombre: 'Estructuras de Datos', codigo: 'ICI-304', semestre: 3 },
    { nombre: 'Inglés I', codigo: 'ICI-305', semestre: 3 },
    { nombre: 'Administración General', codigo: 'ICI-306', semestre: 3 },
    { nombre: 'Cálculo en Varias Variables', codigo: 'ICI-401', semestre: 4 },
    { nombre: 'Ecuaciones Diferenciales', codigo: 'ICI-402', semestre: 4 },
    { nombre: 'Electromagnetismo', codigo: 'ICI-403', semestre: 4 },
    { nombre: 'Modelamiento de Procesos e Información', codigo: 'ICI-404', semestre: 4 },
    { nombre: 'Inglés II', codigo: 'ICI-405', semestre: 4 },
    { nombre: 'Formación Integral Oferta Institucional', codigo: 'ICI-406', semestre: 4 },
    { nombre: 'Ondas, Óptica y Física Moderna', codigo: 'ICI-501', semestre: 5 },
    { nombre: 'Sistemas Digitales', codigo: 'ICI-502', semestre: 5 },
    { nombre: 'Fundamentos de Ciencias de la Computación', codigo: 'ICI-503', semestre: 5 },
    { nombre: 'Teoría de Sistemas', codigo: 'ICI-504', semestre: 5 },
    { nombre: 'Inglés III', codigo: 'ICI-505', semestre: 5 },
    { nombre: 'Gestión Contable', codigo: 'ICI-506', semestre: 5 },
    { nombre: 'Estadística y Probabilidades', codigo: 'ICI-601', semestre: 6 },
    { nombre: 'Economía', codigo: 'ICI-602', semestre: 6 },
    { nombre: 'Análisis y Diseño de Algoritmos', codigo: 'ICI-603', semestre: 6 },
    { nombre: 'Base de Datos', codigo: 'ICI-604', semestre: 6 },
    { nombre: 'Inglés IV', codigo: 'ICI-605', semestre: 6 },
    { nombre: 'Práctica Profesional I', codigo: 'ICI-606', semestre: 6 },
    { nombre: 'Investigación de Operaciones', codigo: 'ICI-701', semestre: 7 },
    { nombre: 'Arquitectura de Computadores', codigo: 'ICI-702', semestre: 7 },
    { nombre: 'Administración y Prog. de Base de Datos', codigo: 'ICI-703', semestre: 7 },
    { nombre: 'Sistemas de Información', codigo: 'ICI-704', semestre: 7 },
    { nombre: 'Gestión Estratégica', codigo: 'ICI-705', semestre: 7 },
    { nombre: 'Gestión Presupuestaria y Financiera', codigo: 'ICI-706', semestre: 7 },
    { nombre: 'Formación Integral Oferta Institucional', codigo: 'ICI-707', semestre: 7 },
    { nombre: 'Legislación', codigo: 'ICI-801', semestre: 8 },
    { nombre: 'Sistemas Operativos', codigo: 'ICI-802', semestre: 8 },
    { nombre: 'Inteligencia Artificial', codigo: 'ICI-803', semestre: 8 },
    { nombre: 'Ingeniería de Software', codigo: 'ICI-804', semestre: 8 },
    { nombre: 'Formulación y Evaluación de Proyectos', codigo: 'ICI-805', semestre: 8 },
    { nombre: 'Práctica Profesional II', codigo: 'ICI-806', semestre: 8 },
    { nombre: 'Anteproyecto de Título', codigo: 'ICI-901', semestre: 9 },
    { nombre: 'Comunicación de Datos y Redes', codigo: 'ICI-902', semestre: 9 },
    { nombre: 'Electivo Profesional I', codigo: 'ICI-903', semestre: 9 },
    { nombre: 'Gestión de Proyectos de Software', codigo: 'ICI-904', semestre: 9 },
    { nombre: 'Gestión de Recursos Humanos', codigo: 'ICI-905', semestre: 9 },
    { nombre: 'Electivo Profesional II', codigo: 'ICI-906', semestre: 9 },
    { nombre: 'Electivo Profesional III', codigo: 'ICI-907', semestre: 9 },
    { nombre: 'Proyecto de Título', codigo: 'ICI-1001', semestre: 10 },
    { nombre: 'Seguridad Informática', codigo: 'ICI-1002', semestre: 10 },
    { nombre: 'Electivo Profesional IV', codigo: 'ICI-1003', semestre: 10 },
    { nombre: 'Electivo Profesional V', codigo: 'ICI-1004', semestre: 10 },
    { nombre: 'Electivo Profesional VI', codigo: 'ICI-1005', semestre: 10 },
  ],
  DER: [
    { nombre: 'Derecho Romano', codigo: 'DER-101', semestre: 1 },
    { nombre: 'Introducción al Derecho', codigo: 'DER-102', semestre: 1 },
    { nombre: 'Instituciones Políticas', codigo: 'DER-103', semestre: 1 },
    { nombre: 'Microeconomía', codigo: 'DER-104', semestre: 1 },
    { nombre: 'Formación Integral Oferta Institucional', codigo: 'DER-105', semestre: 1 },
    { nombre: 'Formación Integral en Actividades Extra Programáticas', codigo: 'DER-106', semestre: 1 },
    { nombre: 'Derecho y Sociedad', codigo: 'DER-201', semestre: 2 },
    { nombre: 'Derecho Internacional Público y de los Derechos Humanos', codigo: 'DER-202', semestre: 2 },
    { nombre: 'Habilidades Jurídicas Básicas', codigo: 'DER-203', semestre: 2 },
    { nombre: 'Macroeconomía', codigo: 'DER-204', semestre: 2 },
    { nombre: 'Formación Integral Oferta Institucional', codigo: 'DER-205', semestre: 2 },
    { nombre: 'Inglés Comunicacional I', codigo: 'DER-206', semestre: 2 },
    { nombre: 'Persona y Teoría del Acto Jurídico', codigo: 'DER-301', semestre: 3 },
    { nombre: 'Administración y Contabilidad', codigo: 'DER-302', semestre: 3 },
    { nombre: 'Bases y Órganos Constitucionales', codigo: 'DER-303', semestre: 3 },
    { nombre: 'Derecho Procesal Orgánico', codigo: 'DER-304', semestre: 3 },
    { nombre: 'Formación Integral Oferta Institucional', codigo: 'DER-305', semestre: 3 },
    { nombre: 'Inglés Comunicacional II', codigo: 'DER-306', semestre: 3 },
    { nombre: 'Derechos Reales y Obligaciones', codigo: 'DER-401', semestre: 4 },
    { nombre: 'Taller de Integración Jurídica', codigo: 'DER-402', semestre: 4 },
    { nombre: 'Derechos y Garantías Constitucionales', codigo: 'DER-403', semestre: 4 },
    { nombre: 'Normas Comunes a Todo Procedimiento y Prueba', codigo: 'DER-404', semestre: 4 },
    { nombre: 'Teoría General del Derecho Laboral y Contrato Individual de Trabajo', codigo: 'DER-405', semestre: 4 },
    { nombre: 'Inglés Comunicacional III', codigo: 'DER-406', semestre: 4 },
    { nombre: 'Efectos de las Obligaciones y Responsabilidad Civil', codigo: 'DER-501', semestre: 5 },
    { nombre: 'Teoría del Delito y Derecho Penal Parte General', codigo: 'DER-502', semestre: 5 },
    { nombre: 'Actos y Procedimiento Administrativo', codigo: 'DER-503', semestre: 5 },
    { nombre: 'Procedimiento Ordinario y Recursos Procesales', codigo: 'DER-504', semestre: 5 },
    { nombre: 'Derecho Laboral Colectivo y Procedimiento Laboral', codigo: 'DER-505', semestre: 5 },
    { nombre: 'Inglés Comunicacional IV', codigo: 'DER-506', semestre: 5 },
    { nombre: 'Contratos', codigo: 'DER-601', semestre: 6 },
    { nombre: 'Derecho Penal Parte Especial', codigo: 'DER-602', semestre: 6 },
    { nombre: 'Contratación Administrativa y Función Pública', codigo: 'DER-603', semestre: 6 },
    { nombre: 'Procedimiento Ejecutivo y Especiales', codigo: 'DER-604', semestre: 6 },
    { nombre: 'Práctica Jurídica', codigo: 'DER-605', semestre: 6 },
    { nombre: 'Formación Integral Actividades Extra Programáticas', codigo: 'DER-606', semestre: 6 },
    { nombre: 'Derecho de Familia', codigo: 'DER-701', semestre: 7 },
    { nombre: 'Estructura de la Obligación Tributaria', codigo: 'DER-702', semestre: 7 },
    { nombre: 'Acto de Comercio y Derecho Societario', codigo: 'DER-703', semestre: 7 },
    { nombre: 'Derecho Procesal Penal', codigo: 'DER-704', semestre: 7 },
    { nombre: 'Informática Jurídica', codigo: 'DER-705', semestre: 7 },
    { nombre: 'Negociación', codigo: 'DER-706', semestre: 7 },
    { nombre: 'Derecho Sucesorio', codigo: 'DER-801', semestre: 8 },
    { nombre: 'Parte especial: IVA y Renta', codigo: 'DER-802', semestre: 8 },
    { nombre: 'Sociedad Anónima y Títulos de Crédito', codigo: 'DER-803', semestre: 8 },
    { nombre: 'Curso de Profundización I', codigo: 'DER-804', semestre: 8 },
    { nombre: 'Derecho Informático', codigo: 'DER-805', semestre: 8 },
    { nombre: 'Litigación', codigo: 'DER-806', semestre: 8 },
    { nombre: 'Derecho Internacional Privado', codigo: 'DER-901', semestre: 9 },
    { nombre: 'Curso de Profundización II', codigo: 'DER-902', semestre: 9 },
    { nombre: 'Clínica Jurídica', codigo: 'DER-903', semestre: 9 },
    { nombre: 'Litigación Especializada', codigo: 'DER-904', semestre: 9 },
    { nombre: 'Seminario de Licenciatura', codigo: 'DER-1001', semestre: 10 },
    { nombre: 'Curso de Profundización III', codigo: 'DER-1002', semestre: 10 },
    { nombre: 'Curso de Profundización IV', codigo: 'DER-1003', semestre: 10 },
  ],
};

//* ETIQUETAS ───────────────────────────────────────────────────────────────────────────────────────────────────────────
const etiquetas = [
  { nombre_etiqueta: 'Frontend' },
  { nombre_etiqueta: 'Backend' },
  { nombre_etiqueta: 'Base de Datos' },
  { nombre_etiqueta: 'Inteligencia Artificial' },
  { nombre_etiqueta: 'Diseño UX/UI' },
  { nombre_etiqueta: 'Mobile' },
  { nombre_etiqueta: 'DevOps' },
  { nombre_etiqueta: 'Derecho Digital' },
];

//* USUARIOS ───────────────────────────────────────────────────────────────────────────────────────────────────────────
const usuarios = [
  {
    correo: 'admin@inface.cl',
    contrasena: 'Admin1234',
    rol: 'superadmin',
    nombre_usuario: 'superadmin',
    carrera: null,
    campus: 'Concepción',
  },
  {
    correo: 'estudiante_ieci@inface.cl',
    contrasena: 'Test1234',
    rol: 'estudiante',
    nombre_usuario: 'est_ieci',
    carrera: 'IECI',
    campus: 'Concepción',
  },
  {
    correo: 'estudiante_ici@inface.cl',
    contrasena: 'Test1234',
    rol: 'estudiante',
    nombre_usuario: 'est_ici',
    carrera: 'ICI',
    campus: 'Chillán',
  },
  {
    correo: 'estudiante_der@inface.cl',
    contrasena: 'Test1234',
    rol: 'estudiante',
    nombre_usuario: 'est_der',
    carrera: 'DER',
    campus: "Concepción",
  },
  {
    correo: 'tutor@inface.cl',
    contrasena: 'Test1234',
    rol: 'tutor',
    nombre_usuario: 'tutor_test',
    carrera: 'IECI',
    campus: 'Concepción',
  },
];

//* MAIN ───────────────────────────────────────────────────────────────────────────────────────────────────────────
async function main() {
  console.log('Iniciando seed...');

  //* Carreras
  const carrerasCreadas = {};
  for (const c of carreras) {
    const carrera = await prisma.carrera.upsert({
      where: { codigo: c.codigo },
      update: {},
      create: c,
    });
    carrerasCreadas[c.codigo] = carrera;
    console.log(`Carrera: ${carrera.nombre}`);
  }

  //* Ramos y relación con carrera
  for (const [codigoCarrera, listaRamos] of Object.entries(ramos)) {
    for (const r of listaRamos) {
      const ramo = await prisma.ramo.upsert({
        where: { codigo: r.codigo },
        update: {},
        create: { nombre: r.nombre, codigo: r.codigo, semestre: r.semestre },
      });

      await prisma.ramoCarrera.upsert({
        where: {
          ramo_id_carrera_id: {
            ramo_id: ramo.id,
            carrera_id: carrerasCreadas[codigoCarrera].id,
          },
        },
        update: {},
        create: {
          ramo_id: ramo.id,
          carrera_id: carrerasCreadas[codigoCarrera].id,
        },
      });
    }
    console.log(`Ramos de ${codigoCarrera}: ${listaRamos.length} ramos`);
  }

  //* Usuarios de prueba
  for (const u of usuarios) {
    const hash = await bcrypt.hash(u.contrasena, 10);
    const usuario = await prisma.usuario.upsert({
      where: { correo: u.correo },
      update: {},
      create: {
        correo: u.correo,
        contrasena: hash,
        rol: u.rol,
        perfil: { create: { nombre_usuario: u.nombre_usuario, campus: u.campus } },
      },
      include: { perfil: true },
    });

    if (u.carrera) {
      await prisma.usuarioCarrera.upsert({
        where: {
          usuario_id_carrera_id: {
            usuario_id: usuario.id,
            carrera_id: carrerasCreadas[u.carrera].id,
          },
        },
        update: {},
        create: {
          usuario_id: usuario.id,
          carrera_id: carrerasCreadas[u.carrera].id,
        },
      });
    }

    console.log(`Usuario: ${u.correo} (${u.rol})`);
  }

  //* Tipo de etiqueta base
  const tipoEtiqueta = await prisma.tipoEtiqueta.upsert({
    where: { id: 1 },
    update: {},
    create: { nombre_tipo_etiqueta: 'Tecnología' },
  });

  //* Etiquetas
  const etiquetasCreadas = {};
  for (const e of etiquetas) {
    const etiqueta = await prisma.etiqueta.upsert({
      where: { nombre_etiqueta: e.nombre_etiqueta },
      update: {},
      create: {
        nombre_etiqueta: e.nombre_etiqueta,
        nombre_normalizado: e.nombre_etiqueta.toLowerCase().replace(/\s+/g, '-').replace(/\//g, '-'),
        tipo_etiqueta_id: tipoEtiqueta.id,
        es_predeterminada: true,
        estado: 'aprobada',
      },
    });
    etiquetasCreadas[e.nombre_etiqueta] = etiqueta;
  }
  console.log(`Etiquetas: ${Object.keys(etiquetasCreadas).length} creadas`);

  //* Proyectos
  const usuarioIECI = await prisma.usuario.findUnique({ where: { correo: 'estudiante_ieci@inface.cl' } });
  const usuarioICI = await prisma.usuario.findUnique({ where: { correo: 'estudiante_ici@inface.cl' } });
  const usuarioDER = await prisma.usuario.findUnique({ where: { correo: 'estudiante_der@inface.cl' } });
  const usuarioTutor = await prisma.usuario.findUnique({ where: { correo: 'tutor@inface.cl' } });

  const proyectos = [
    {
      creador_id: usuarioIECI.id,
      titulo_proyecto: 'Plataforma de aprendizaje colaborativo',
      descripcion_proyecto: 'Desarrollo de una plataforma web para que estudiantes compartan recursos y apuntes de forma organizada.',
      modalidad_proyecto: 'remoto',
      maximo_integrantes: 4,
      estado_proyecto: 'abierto',
      fecha_inicio: new Date('2026-07-01'),
      fecha_fin: new Date('2026-12-01'),
      etiquetas: ['Frontend', 'Backend', 'Base de Datos'],
    },
    {
      creador_id: usuarioICI.id,
      titulo_proyecto: 'Sistema de detección de plagio con IA',
      descripcion_proyecto: 'Herramienta que usa NLP para detectar similitudes en trabajos académicos entregados en la plataforma.',
      modalidad_proyecto: 'hibrido',
      maximo_integrantes: 3,
      estado_proyecto: 'abierto',
      fecha_inicio: new Date('2026-07-15'),
      fecha_fin: new Date('2026-11-30'),
      etiquetas: ['Inteligencia Artificial', 'Backend'],
    },
    {
      creador_id: usuarioTutor.id,
      titulo_proyecto: 'App mobile de tutorías universitarias',
      descripcion_proyecto: 'Aplicación móvil para conectar tutores con estudiantes, con agenda, chat y calificaciones.',
      modalidad_proyecto: 'remoto',
      maximo_integrantes: 5,
      estado_proyecto: 'abierto',
      fecha_inicio: new Date('2026-08-01'),
      fecha_fin: new Date('2027-01-31'),
      etiquetas: ['Mobile', 'Backend', 'Diseño UX/UI'],
    },
    {
      creador_id: usuarioDER.id,
      titulo_proyecto: 'Repositorio de jurisprudencia digital',
      descripcion_proyecto: 'Sistema para indexar y buscar fallos judiciales, con filtros por materia, tribunal y fecha.',
      modalidad_proyecto: 'presencial',
      maximo_integrantes: 3,
      estado_proyecto: 'en_progreso',
      fecha_inicio: new Date('2026-06-01'),
      fecha_fin: new Date('2026-10-01'),
      etiquetas: ['Derecho Digital', 'Base de Datos', 'Frontend'],
    },
    {
      creador_id: usuarioIECI.id,
      titulo_proyecto: 'Dashboard de métricas académicas',
      descripcion_proyecto: 'Panel de control para que docentes visualicen el rendimiento de sus estudiantes en tiempo real.',
      modalidad_proyecto: 'hibrido',
      maximo_integrantes: 4,
      estado_proyecto: 'abierto',
      fecha_inicio: new Date('2026-07-10'),
      fecha_fin: new Date('2026-12-15'),
      etiquetas: ['Frontend', 'Diseño UX/UI', 'Base de Datos'],
    },
  ];

  for (const p of proyectos) {
    const { etiquetas: etiquetasProyecto, ...datos } = p;
    await prisma.proyecto.create({
      data: {
        ...datos,
        etiquetas: {
          create: etiquetasProyecto.map(nombre => ({
            etiqueta_id: etiquetasCreadas[nombre].id,
          })),
        },
      },
    });
    console.log(`Proyecto: ${p.titulo_proyecto}`);
  }

  console.log('\nSeed completado.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

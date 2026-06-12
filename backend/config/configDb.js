'use strict';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

export async function connectDB() {
  try {
    await prisma.$connect();
    console.log('=> Conexión exitosa a la base de datos PostgreSQL!');
  } catch (error) {
    console.error('Error al conectar con la base de datos:', error);
    process.exit(1);
  }
}

export default prisma;

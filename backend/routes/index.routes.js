import { Router } from 'express';
import authRoutes from './auth.routes.js';
import apunteRoutes from './apunte.routes.js';
import archivoRoutes from './archivo.routes.js';
import votoRoutes from './voto.routes.js';

function routerApi(app) {
  const router = Router();
  app.use('/api', router);

  router.use('/auth', authRoutes);
  router.use('/apuntes', apunteRoutes); 
  router.use('/archivos', archivoRoutes);
  router.use('/votos', votoRoutes);
}

export { routerApi };

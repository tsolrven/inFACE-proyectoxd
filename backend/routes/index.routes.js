import { Router } from 'express';
import authRoutes from './auth.routes.js';
import apunteRoutes from './apunte.routes.js';

function routerApi(app) {
  const router = Router();
  app.use('/api', router);

  router.use('/auth', authRoutes);
  router.use('/apuntes', apunteRoutes); 
}

export { routerApi };

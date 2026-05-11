import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/configDb.js';
import { PORT } from './config/configEnv.js';

const app = express();

app.use(
  cors({
    credentials: true,
    origin: true,
  }),
);

app.get('/', (req, res) => {
  res.send('Backend funcionando :3');
});

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.log('Error al conectar con la base de datos:', error);
    process.exit(1);
  });

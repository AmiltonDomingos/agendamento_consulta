import express from 'express';
import cors from 'cors';
import appointmentRoutes from './modules/appointments/appointment.routes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/healthz', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Clínica Sagrada Esperança API',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/appointments', appointmentRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada.' });
});

app.use((err, req, res, next) => {
  console.error('[ERRO]', err);
  res.status(500).json({ error: 'Erro interno do servidor.' });
});

export default app;

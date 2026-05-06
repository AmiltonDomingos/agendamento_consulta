import 'dotenv/config';
import app from './app.js';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Clínica Sagrada Esperança API iniciada na porta ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/healthz`);
  console.log(`Compromissos: http://localhost:${PORT}/api/appointments`);
});

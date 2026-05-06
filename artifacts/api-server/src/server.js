import 'dotenv/config';
import { app } from './app.js';

const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT);

console.log(`Clínica Sagrada Esperança API iniciada na porta ${PORT}`);
console.log(`Documentação: http://localhost:${PORT}/api/docs`);
console.log(`Health check: http://localhost:${PORT}/api/healthz`);

import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { swagger } from '@elysiajs/swagger';
import { appointmentRoutes } from './modules/appointments/appointment.routes.js';

/**
 * Aplicação Elysia principal.
 * Configura CORS, Swagger, tratamento global de erros e rotas.
 */
export const app = new Elysia()
  .use(cors())
  .use(
    swagger({
      documentation: {
        info: {
          title: 'Clínica Sagrada Esperança — API',
          version: '1.0.0',
          description:
            'API RESTful para gestão de consultas médicas.\n' +
            'Stack: Bun.js · Elysia.js · PostgreSQL · Drizzle ORM',
        },
        tags: [
          { name: 'Compromissos', description: 'Operações CRUD sobre consultas agendadas' },
          { name: 'Sistema',      description: 'Endpoints de monitorização' },
        ],
      },
      path: '/api/docs',
    }),
  )
  .onError(({ error, code, set }) => {
    if (code === 'VALIDATION') {
      set.status = 400;
      const firstError = error.all?.[0];
      const detail = firstError
        ? `Campo '${firstError.path?.replace('/', '') || 'desconhecido'}': ${firstError.message}`
        : 'Dados inválidos. Verifique os campos enviados.';
      return { error: detail, statusCode: 400 };
    }

    if (error.status && typeof error.status === 'number') {
      set.status = error.status;
      return { error: error.message, statusCode: error.status };
    }

    console.error('[ERRO INTERNO]', error);
    set.status = 500;
    return { error: 'Erro interno do servidor.', statusCode: 500 };
  })
  .get(
    '/api/healthz',
    () => ({
      status: 'ok',
      service: 'Clínica Sagrada Esperança API',
      runtime: 'Bun ' + Bun.version,
      timestamp: new Date().toISOString(),
    }),
    { detail: { summary: 'Health check', tags: ['Sistema'] } },
  )
  .use(appointmentRoutes);

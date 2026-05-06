import { Elysia, t } from 'elysia';
import { appointmentController } from './appointment.controller.js';
import { SERVICE_OPTIONS } from './appointment.model.js';

const serviceEnum = t.Union(SERVICE_OPTIONS.map((s) => t.Literal(s)));
const statusEnum  = t.Union([t.Literal('scheduled'), t.Literal('cancelled')]);

/**
 * Plugin Elysia com todas as rotas de compromissos.
 * Validação de inputs via TypeBox (nativo do Elysia).
 */
export const appointmentRoutes = new Elysia({ prefix: '/api/appointments' })
  .get('/', ({ query }) => appointmentController.getAll(query), {
    query: t.Object({
      date:    t.Optional(t.String({ description: 'Filtro por data YYYY-MM-DD' })),
      service: t.Optional(t.String({ description: 'Filtro por serviço' })),
      status:  t.Optional(t.String({ description: 'Filtro por status: scheduled | cancelled' })),
    }),
    detail: { summary: 'Listar compromissos', tags: ['Compromissos'] },
  })
  .get('/:id', ({ params }) => appointmentController.getById(params.id), {
    params: t.Object({ id: t.String({ description: 'UUID do compromisso' }) }),
    detail: { summary: 'Obter por ID', tags: ['Compromissos'] },
  })
  .post('/', ({ body, set }) => appointmentController.create(body, set), {
    body: t.Object({
      clientName: t.String({ minLength: 2, maxLength: 100, description: 'Nome do paciente' }),
      service:    serviceEnum,
      date:       t.String({ pattern: '^\\d{4}-\\d{2}-\\d{2}$', description: 'Data YYYY-MM-DD' }),
      time:       t.String({ pattern: '^\\d{2}:\\d{2}$', description: 'Hora HH:MM' }),
    }),
    detail: { summary: 'Criar compromisso', tags: ['Compromissos'] },
  })
  .put('/:id', ({ params, body }) => appointmentController.update(params.id, body), {
    params: t.Object({ id: t.String() }),
    body: t.Object({
      clientName: t.Optional(t.String({ minLength: 2, maxLength: 100 })),
      service:    t.Optional(serviceEnum),
      date:       t.Optional(t.String({ pattern: '^\\d{4}-\\d{2}-\\d{2}$' })),
      time:       t.Optional(t.String({ pattern: '^\\d{2}:\\d{2}$' })),
      status:     t.Optional(statusEnum),
    }),
    detail: { summary: 'Atualizar compromisso', tags: ['Compromissos'] },
  })
  .patch('/:id/cancel', ({ params }) => appointmentController.cancel(params.id), {
    params: t.Object({ id: t.String() }),
    detail: { summary: 'Cancelar compromisso (soft delete)', tags: ['Compromissos'] },
  })
  .delete('/:id', ({ params }) => appointmentController.delete(params.id), {
    params: t.Object({ id: t.String() }),
    detail: { summary: 'Remover permanentemente', tags: ['Compromissos'] },
  });

import { appointmentService } from './appointment.service.js';

/**
 * Controller de compromissos.
 * Faz a ponte entre as rotas Elysia e o serviço de negócio.
 */
export const appointmentController = {
  async getAll({ date, service, status }) {
    const appointments = await appointmentService.getAll({ date, service, status });
    return { data: appointments, total: appointments.length };
  },

  async getById(id) {
    const appointment = await appointmentService.getById(id);
    return { data: appointment };
  },

  async create(body, set) {
    const appointment = await appointmentService.create(body);
    set.status = 201;
    return { data: appointment };
  },

  async update(id, body) {
    const appointment = await appointmentService.update(id, body);
    return { data: appointment };
  },

  async cancel(id) {
    const appointment = await appointmentService.cancel(id);
    return { data: appointment };
  },

  async delete(id) {
    await appointmentService.delete(id);
    return { message: 'Compromisso removido com sucesso.' };
  },
};

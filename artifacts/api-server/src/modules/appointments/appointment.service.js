import { appointmentRepository } from './appointment.repository.js';
import { validateAppointment, SERVICE_OPTIONS, STATUS_OPTIONS } from './appointment.model.js';

export const appointmentService = {
  async getAll(filters) {
    return appointmentRepository.findAll(filters);
  },

  async getById(id) {
    const appointment = await appointmentRepository.findById(id);
    if (!appointment) throw { status: 404, message: 'Compromisso não encontrado.' };
    return appointment;
  },

  async create(data) {
    const errors = validateAppointment(data);
    if (errors.length > 0) throw { status: 400, message: errors.join(' ') };

    const conflict = await appointmentRepository.checkConflict(data.date, data.time);
    if (conflict) throw { status: 409, message: 'Já existe um compromisso agendado para esta data e hora.' };

    return appointmentRepository.create(data);
  },

  async update(id, data) {
    const existing = await appointmentRepository.findById(id);
    if (!existing) throw { status: 404, message: 'Compromisso não encontrado.' };

    if (data.service && !SERVICE_OPTIONS.includes(data.service)) {
      throw { status: 400, message: `Serviço inválido. Deve ser: ${SERVICE_OPTIONS.join(', ')}.` };
    }

    if (data.status && !STATUS_OPTIONS.includes(data.status)) {
      throw { status: 400, message: 'Status inválido. Deve ser "scheduled" ou "cancelled".' };
    }

    if (data.date || data.time) {
      const newDate = data.date || existing.date;
      const newTime = data.time || existing.time;
      const conflict = await appointmentRepository.checkConflict(newDate, newTime, id);
      if (conflict) throw { status: 409, message: 'Já existe um compromisso agendado para esta data e hora.' };
    }

    return appointmentRepository.update(id, data);
  },

  async cancel(id) {
    const existing = await appointmentRepository.findById(id);
    if (!existing) throw { status: 404, message: 'Compromisso não encontrado.' };
    if (existing.status === 'cancelled') throw { status: 400, message: 'Este compromisso já foi cancelado.' };
    return appointmentRepository.update(id, { status: 'cancelled' });
  },

  async delete(id) {
    const existing = await appointmentRepository.findById(id);
    if (!existing) throw { status: 404, message: 'Compromisso não encontrado.' };
    return appointmentRepository.delete(id);
  },
};

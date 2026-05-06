import { appointmentService } from './appointment.service.js';

export const appointmentController = {
  async getAll(req, res) {
    try {
      const { date, service, status } = req.query;
      const appointments = await appointmentService.getAll({ date, service, status });
      res.json({ data: appointments, total: appointments.length });
    } catch (err) {
      res.status(err.status || 500).json({ error: err.message || 'Erro interno do servidor.' });
    }
  },

  async getById(req, res) {
    try {
      const appointment = await appointmentService.getById(req.params.id);
      res.json({ data: appointment });
    } catch (err) {
      res.status(err.status || 500).json({ error: err.message || 'Erro interno do servidor.' });
    }
  },

  async create(req, res) {
    try {
      const appointment = await appointmentService.create(req.body);
      res.status(201).json({ data: appointment });
    } catch (err) {
      res.status(err.status || 500).json({ error: err.message || 'Erro interno do servidor.' });
    }
  },

  async update(req, res) {
    try {
      const appointment = await appointmentService.update(req.params.id, req.body);
      res.json({ data: appointment });
    } catch (err) {
      res.status(err.status || 500).json({ error: err.message || 'Erro interno do servidor.' });
    }
  },

  async cancel(req, res) {
    try {
      const appointment = await appointmentService.cancel(req.params.id);
      res.json({ data: appointment });
    } catch (err) {
      res.status(err.status || 500).json({ error: err.message || 'Erro interno do servidor.' });
    }
  },

  async delete(req, res) {
    try {
      await appointmentService.delete(req.params.id);
      res.json({ message: 'Compromisso removido com sucesso.' });
    } catch (err) {
      res.status(err.status || 500).json({ error: err.message || 'Erro interno do servidor.' });
    }
  },
};

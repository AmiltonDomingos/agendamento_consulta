import { pgTable, uuid, text, date, time, timestamp } from 'drizzle-orm/pg-core';

export const SERVICE_OPTIONS = ['Pediatria', 'Consulta geral', 'Ortopedia', 'Outros'];
export const STATUS_OPTIONS = ['scheduled', 'cancelled'];

/**
 * Schema Drizzle ORM — tabela de compromissos (consultas agendadas).
 */
export const appointmentsTable = pgTable('appointments', {
  id:        uuid('id').defaultRandom().primaryKey(),
  clientName: text('client_name').notNull(),
  service:   text('service').notNull(),
  date:      date('date').notNull(),
  time:      time('time').notNull(),
  status:    text('status').notNull().default('scheduled'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

/**
 * Validação de campos obrigatórios para criação de um compromisso.
 */
export function validateAppointment({ clientName, service, date, time }) {
  const errors = [];

  if (!clientName || clientName.trim().length < 2) {
    errors.push('Nome deve ter pelo menos 2 caracteres.');
  }
  if (!SERVICE_OPTIONS.includes(service)) {
    errors.push(`Serviço inválido. Deve ser um de: ${SERVICE_OPTIONS.join(', ')}.`);
  }
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    errors.push('Data deve estar no formato YYYY-MM-DD.');
  }
  if (!time || !/^\d{2}:\d{2}$/.test(time)) {
    errors.push('Hora deve estar no formato HH:MM.');
  }

  return errors;
}

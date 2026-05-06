import { eq, and, asc } from 'drizzle-orm';
import { db } from '../../config/database.js';
import { appointmentsTable } from './appointment.model.js';

/**
 * Repositório de compromissos.
 * Responsável por todas as operações na base de dados via Drizzle ORM.
 */
export const appointmentRepository = {
  async findAll({ date, service, status } = {}) {
    const conditions = [];

    if (date)    conditions.push(eq(appointmentsTable.date,    date));
    if (service) conditions.push(eq(appointmentsTable.service, service));
    if (status)  conditions.push(eq(appointmentsTable.status,  status));

    return db
      .select()
      .from(appointmentsTable)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(asc(appointmentsTable.date), asc(appointmentsTable.time));
  },

  async findById(id) {
    const results = await db
      .select()
      .from(appointmentsTable)
      .where(eq(appointmentsTable.id, id))
      .limit(1);
    return results[0] || null;
  },

  async checkConflict(date, time, excludeId = null) {
    const results = await db
      .select({ id: appointmentsTable.id })
      .from(appointmentsTable)
      .where(
        and(
          eq(appointmentsTable.date,   date),
          eq(appointmentsTable.time,   time),
          eq(appointmentsTable.status, 'scheduled'),
        ),
      );
    return results.some((r) => r.id !== excludeId);
  },

  async create({ clientName, service, date, time }) {
    const results = await db
      .insert(appointmentsTable)
      .values({ clientName, service, date, time })
      .returning();
    return results[0];
  },

  async update(id, data) {
    const updateData = {};
    if (data.clientName !== undefined) updateData.clientName = data.clientName;
    if (data.service    !== undefined) updateData.service    = data.service;
    if (data.date       !== undefined) updateData.date       = data.date;
    if (data.time       !== undefined) updateData.time       = data.time;
    if (data.status     !== undefined) updateData.status     = data.status;
    updateData.updatedAt = new Date();

    const results = await db
      .update(appointmentsTable)
      .set(updateData)
      .where(eq(appointmentsTable.id, id))
      .returning();
    return results[0] || null;
  },

  async delete(id) {
    const results = await db
      .delete(appointmentsTable)
      .where(eq(appointmentsTable.id, id))
      .returning();
    return results[0] || null;
  },
};

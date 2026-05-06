import { eq, and, asc } from "drizzle-orm";
import { db, appointmentsTable } from "../db";

export interface CreateAppointmentDTO {
  clientName: string;
  service: string;
  date: string;
  time: string;
}

export interface UpdateAppointmentDTO {
  clientName?: string;
  service?: string;
  date?: string;
  time?: string;
  status?: string;
}

export interface ListAppointmentsFilter {
  date?: string;
  service?: string;
  status?: string;
}

/**
 * Serviço responsável pela lógica de negócio dos compromissos.
 * Interage diretamente com o Drizzle ORM e a base de dados PostgreSQL.
 */
export class AppointmentsService {
  /**
   * Lista todos os compromissos com filtros opcionais.
   */
  async findAll(filters: ListAppointmentsFilter = {}) {
    const conditions = [];

    if (filters.date) {
      conditions.push(eq(appointmentsTable.date, filters.date));
    }
    if (filters.service) {
      conditions.push(eq(appointmentsTable.service, filters.service));
    }
    if (filters.status) {
      conditions.push(eq(appointmentsTable.status, filters.status));
    }

    return db
      .select()
      .from(appointmentsTable)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(asc(appointmentsTable.date), asc(appointmentsTable.time));
  }

  /**
   * Busca um compromisso pelo seu ID.
   */
  async findById(id: string) {
    const results = await db
      .select()
      .from(appointmentsTable)
      .where(eq(appointmentsTable.id, id))
      .limit(1);

    return results[0] ?? null;
  }

  /**
   * Verifica se existe conflito de horário (mesma data e hora).
   * Ignora o ID fornecido (útil para atualizações).
   */
  async checkConflict(date: string, time: string, excludeId?: string): Promise<boolean> {
    const results = await db
      .select({ id: appointmentsTable.id })
      .from(appointmentsTable)
      .where(
        and(
          eq(appointmentsTable.date, date),
          eq(appointmentsTable.time, time),
          eq(appointmentsTable.status, "scheduled"),
        ),
      );

    return results.some((r) => r.id !== excludeId);
  }

  /**
   * Cria um novo compromisso.
   */
  async create(data: CreateAppointmentDTO) {
    const results = await db
      .insert(appointmentsTable)
      .values({
        clientName: data.clientName,
        service: data.service,
        date: data.date,
        time: data.time,
      })
      .returning();

    return results[0]!;
  }

  /**
   * Atualiza um compromisso existente pelo ID.
   */
  async update(id: string, data: UpdateAppointmentDTO) {
    const results = await db
      .update(appointmentsTable)
      .set({
        ...(data.clientName !== undefined && { clientName: data.clientName }),
        ...(data.service !== undefined && { service: data.service }),
        ...(data.date !== undefined && { date: data.date }),
        ...(data.time !== undefined && { time: data.time }),
        ...(data.status !== undefined && { status: data.status }),
        updatedAt: new Date(),
      })
      .where(eq(appointmentsTable.id, id))
      .returning();

    return results[0] ?? null;
  }

  /**
   * Cancela (soft delete) um compromisso pelo ID.
   */
  async cancel(id: string) {
    return this.update(id, { status: "cancelled" });
  }

  /**
   * Remove permanentemente um compromisso pelo ID.
   */
  async delete(id: string) {
    const results = await db
      .delete(appointmentsTable)
      .where(eq(appointmentsTable.id, id))
      .returning();

    return results[0] ?? null;
  }
}

export const appointmentsService = new AppointmentsService();

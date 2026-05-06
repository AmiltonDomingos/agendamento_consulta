import { pgTable, uuid, text, date, time, timestamp } from "drizzle-orm/pg-core";

/**
 * Serviços disponíveis na clínica.
 */
export const SERVICE_OPTIONS = [
  "Pediatria",
  "Consulta geral",
  "Ortopedia",
  "Outros",
] as const;

export type ServiceType = (typeof SERVICE_OPTIONS)[number];

/**
 * Estados possíveis de um compromisso.
 */
export const STATUS_OPTIONS = ["scheduled", "cancelled"] as const;

export type StatusType = (typeof STATUS_OPTIONS)[number];

/**
 * Tabela de compromissos (consultas agendadas).
 */
export const appointmentsTable = pgTable("appointments", {
  id: uuid("id").defaultRandom().primaryKey(),
  clientName: text("client_name").notNull(),
  service: text("service").notNull(),
  date: date("date").notNull(),
  time: time("time").notNull(),
  status: text("status").notNull().default("scheduled"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export type Appointment = typeof appointmentsTable.$inferSelect;
export type NewAppointment = typeof appointmentsTable.$inferInsert;

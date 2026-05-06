import { Elysia, t } from "elysia";
import {
  listAppointments,
  getAppointment,
  createAppointment,
  updateAppointment,
  cancelAppointment,
  deleteAppointment,
} from "../controllers/appointments.controller";
import { SERVICE_OPTIONS } from "../db/schema/appointments";

const serviceEnum = t.Union(SERVICE_OPTIONS.map((s) => t.Literal(s)));
const statusEnum = t.Union([t.Literal("scheduled"), t.Literal("cancelled")]);

/**
 * Plugin Elysia com todas as rotas de compromissos.
 * Prefixo: /api/appointments
 */
export const appointmentsRoutes = new Elysia({ prefix: "/appointments" })
  .get("/", listAppointments, {
    query: t.Object({
      date: t.Optional(
        t.String({ description: "Filtro por data no formato YYYY-MM-DD" }),
      ),
      service: t.Optional(
        t.String({ description: "Filtro por tipo de serviço" }),
      ),
      status: t.Optional(
        t.String({ description: "Filtro por status: scheduled | cancelled" }),
      ),
    }),
    detail: {
      summary: "Listar compromissos",
      description:
        "Retorna todos os compromissos com filtros opcionais por data, serviço e status.",
      tags: ["Compromissos"],
    },
  })
  .get("/:id", getAppointment, {
    params: t.Object({
      id: t.String({ description: "UUID do compromisso" }),
    }),
    detail: {
      summary: "Obter compromisso por ID",
      description: "Retorna um único compromisso pelo seu identificador único.",
      tags: ["Compromissos"],
    },
  })
  .post("/", createAppointment, {
    body: t.Object({
      clientName: t.String({
        minLength: 2,
        maxLength: 100,
        description: "Nome completo do paciente",
      }),
      service: serviceEnum,
      date: t.String({
        pattern: "^\\d{4}-\\d{2}-\\d{2}$",
        description: "Data da consulta no formato YYYY-MM-DD",
      }),
      time: t.String({
        pattern: "^\\d{2}:\\d{2}$",
        description: "Hora da consulta no formato HH:MM",
      }),
    }),
    detail: {
      summary: "Criar compromisso",
      description:
        "Cria um novo compromisso. Retorna 409 se já existir um agendamento para a mesma data e hora.",
      tags: ["Compromissos"],
    },
  })
  .put("/:id", updateAppointment, {
    params: t.Object({
      id: t.String({ description: "UUID do compromisso" }),
    }),
    body: t.Object({
      clientName: t.Optional(t.String({ minLength: 2, maxLength: 100 })),
      service: t.Optional(serviceEnum),
      date: t.Optional(t.String({ pattern: "^\\d{4}-\\d{2}-\\d{2}$" })),
      time: t.Optional(t.String({ pattern: "^\\d{2}:\\d{2}$" })),
      status: t.Optional(statusEnum),
    }),
    detail: {
      summary: "Atualizar compromisso",
      description:
        "Atualiza parcialmente um compromisso existente. Verifica conflitos de horário automaticamente.",
      tags: ["Compromissos"],
    },
  })
  .patch("/:id/cancel", cancelAppointment, {
    params: t.Object({
      id: t.String({ description: "UUID do compromisso" }),
    }),
    detail: {
      summary: "Cancelar compromisso",
      description:
        "Cancela um compromisso (soft delete). O registo permanece na base de dados com status 'cancelled'.",
      tags: ["Compromissos"],
    },
  })
  .delete("/:id", deleteAppointment, {
    params: t.Object({
      id: t.String({ description: "UUID do compromisso" }),
    }),
    detail: {
      summary: "Remover compromisso",
      description: "Remove permanentemente um compromisso da base de dados.",
      tags: ["Compromissos"],
    },
  });

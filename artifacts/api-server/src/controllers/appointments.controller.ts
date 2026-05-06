import { appointmentsService } from "../services/appointments.service";
import { SERVICE_OPTIONS, STATUS_OPTIONS } from "../db/schema/appointments";
import { HttpError } from "../middleware/error-handler";

/**
 * Lista todos os compromissos.
 * Suporta filtros opcionais por data, serviço e status.
 */
export const listAppointments = async ({
  query,
}: {
  query: { date?: string; service?: string; status?: string };
}) => {
  const appointments = await appointmentsService.findAll(query);
  return { data: appointments, total: appointments.length };
};

/**
 * Retorna um compromisso pelo ID.
 * Lança 404 se não encontrado.
 */
export const getAppointment = async ({
  params,
}: {
  params: { id: string };
}) => {
  const appointment = await appointmentsService.findById(params.id);

  if (!appointment) {
    throw new HttpError(404, "Compromisso não encontrado.");
  }

  return { data: appointment };
};

/**
 * Cria um novo compromisso.
 * Verifica conflito de horário antes de persistir.
 * Retorna 201 em caso de sucesso.
 */
export const createAppointment = async ({
  body,
  set,
}: {
  body: { clientName: string; service: string; date: string; time: string };
  set: { status: number | string };
}) => {
  if (!SERVICE_OPTIONS.includes(body.service as (typeof SERVICE_OPTIONS)[number])) {
    throw new HttpError(
      400,
      `Serviço inválido. Deve ser um dos seguintes: ${SERVICE_OPTIONS.join(", ")}.`,
    );
  }

  const hasConflict = await appointmentsService.checkConflict(body.date, body.time);

  if (hasConflict) {
    throw new HttpError(
      409,
      "Já existe um compromisso agendado para esta data e hora.",
    );
  }

  const appointment = await appointmentsService.create(body);
  set.status = 201;
  return { data: appointment };
};

/**
 * Atualiza um compromisso existente.
 * Verifica existência e conflito de horário.
 */
export const updateAppointment = async ({
  params,
  body,
}: {
  params: { id: string };
  body: {
    clientName?: string;
    service?: string;
    date?: string;
    time?: string;
    status?: string;
  };
}) => {
  const existing = await appointmentsService.findById(params.id);

  if (!existing) {
    throw new HttpError(404, "Compromisso não encontrado.");
  }

  if (body.service !== undefined && !SERVICE_OPTIONS.includes(body.service as (typeof SERVICE_OPTIONS)[number])) {
    throw new HttpError(
      400,
      `Serviço inválido. Deve ser um dos seguintes: ${SERVICE_OPTIONS.join(", ")}.`,
    );
  }

  if (body.status !== undefined && !STATUS_OPTIONS.includes(body.status as (typeof STATUS_OPTIONS)[number])) {
    throw new HttpError(
      400,
      `Status inválido. Deve ser "scheduled" ou "cancelled".`,
    );
  }

  if (body.date !== undefined || body.time !== undefined) {
    const newDate = body.date ?? existing.date;
    const newTime = body.time ?? existing.time;
    const hasConflict = await appointmentsService.checkConflict(newDate, newTime, params.id);

    if (hasConflict) {
      throw new HttpError(
        409,
        "Já existe um compromisso agendado para esta data e hora.",
      );
    }
  }

  const updated = await appointmentsService.update(params.id, body);
  return { data: updated };
};

/**
 * Cancela um compromisso (soft delete) pelo ID.
 * Lança 400 se já estiver cancelado.
 */
export const cancelAppointment = async ({
  params,
}: {
  params: { id: string };
}) => {
  const existing = await appointmentsService.findById(params.id);

  if (!existing) {
    throw new HttpError(404, "Compromisso não encontrado.");
  }

  if (existing.status === "cancelled") {
    throw new HttpError(400, "Este compromisso já foi cancelado.");
  }

  const cancelled = await appointmentsService.cancel(params.id);
  return { data: cancelled };
};

/**
 * Remove permanentemente um compromisso pelo ID.
 */
export const deleteAppointment = async ({
  params,
}: {
  params: { id: string };
}) => {
  const existing = await appointmentsService.findById(params.id);

  if (!existing) {
    throw new HttpError(404, "Compromisso não encontrado.");
  }

  await appointmentsService.delete(params.id);
  return { message: "Compromisso removido com sucesso." };
};

export const SERVICE_OPTIONS = ['Pediatria', 'Consulta geral', 'Ortopedia', 'Outros'];
export const STATUS_OPTIONS = ['scheduled', 'cancelled'];

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

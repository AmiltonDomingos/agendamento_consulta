import pool from '../../config/database.js';

export const appointmentRepository = {
  async findAll({ date, service, status } = {}) {
    let query = 'SELECT * FROM appointments WHERE 1=1';
    const params = [];
    let i = 1;

    if (date)    { query += ` AND date = $${i++}`;    params.push(date); }
    if (service) { query += ` AND service = $${i++}`; params.push(service); }
    if (status)  { query += ` AND status = $${i++}`;  params.push(status); }

    query += ' ORDER BY date ASC, time ASC';

    const result = await pool.query(query, params);
    return result.rows;
  },

  async findById(id) {
    const result = await pool.query(
      'SELECT * FROM appointments WHERE id = $1',
      [id],
    );
    return result.rows[0] || null;
  },

  async checkConflict(date, time, excludeId = null) {
    let query = `
      SELECT id FROM appointments
      WHERE date = $1 AND time = $2 AND status = 'scheduled'
    `;
    const params = [date, time];

    if (excludeId) {
      query += ` AND id != $3`;
      params.push(excludeId);
    }

    const result = await pool.query(query, params);
    return result.rows.length > 0;
  },

  async create({ clientName, service, date, time }) {
    const result = await pool.query(
      `INSERT INTO appointments (client_name, service, date, time)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [clientName, service, date, time],
    );
    return result.rows[0];
  },

  async update(id, data) {
    const fields = [];
    const params = [];
    let i = 1;

    if (data.clientName !== undefined) { fields.push(`client_name = $${i++}`); params.push(data.clientName); }
    if (data.service    !== undefined) { fields.push(`service = $${i++}`);     params.push(data.service); }
    if (data.date       !== undefined) { fields.push(`date = $${i++}`);        params.push(data.date); }
    if (data.time       !== undefined) { fields.push(`time = $${i++}`);        params.push(data.time); }
    if (data.status     !== undefined) { fields.push(`status = $${i++}`);      params.push(data.status); }

    fields.push(`updated_at = NOW()`);
    params.push(id);

    const result = await pool.query(
      `UPDATE appointments SET ${fields.join(', ')} WHERE id = $${i} RETURNING *`,
      params,
    );
    return result.rows[0] || null;
  },

  async delete(id) {
    const result = await pool.query(
      'DELETE FROM appointments WHERE id = $1 RETURNING *',
      [id],
    );
    return result.rows[0] || null;
  },
};

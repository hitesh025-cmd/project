import pool from '../config.js';
import { createLogInternal } from './logController.js';

export const getRequests = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM requests');
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const createRequest = async (req, res) => {
  const { patientName, bloodGroup, hospitalName, units, urgency } = req.body;
  try {
    const { rows } = await pool.query(
      'INSERT INTO requests ("patientName", "bloodGroup", "hospitalName", units, urgency) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [patientName, bloodGroup, hospitalName, units, urgency]
    );
    res.json({ id: rows[0].id, ...req.body, status: 'pending', assignedDonorId: null });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const updateRequestStatus = async (req, res) => {
  const { status, assignedDonorId } = req.body;
  try {
    const { rows } = await pool.query('SELECT "patientName" FROM requests WHERE id = $1', [req.params.id]);
    const patientName = rows.length > 0 ? rows[0].patientName : 'Unknown';

    await pool.query('UPDATE requests SET status = $1, "assignedDonorId" = $2 WHERE id = $3', [status, assignedDonorId || null, req.params.id]);
    
    let detail = `Changed request for ${patientName} to ${status}`;
    if (status === 'fulfilled' && assignedDonorId) {
      detail = `Fulfilled request for ${patientName} by assigning donor ID ${assignedDonorId}`;
    }
    await createLogInternal('Update Request', detail);

    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

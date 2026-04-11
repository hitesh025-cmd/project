import pool from '../config.js';
import { createLogInternal } from './logController.js';

export const getHospitals = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM hospitals');
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const createHospital = async (req, res) => {
  const { name, city, address, contact, email } = req.body;
  try {
    const { rows } = await pool.query(
      'INSERT INTO hospitals (name, city, address, contact, email) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [name, city, address || '', contact, email || '']
    );
    await createLogInternal('Register Hospital', `Registered hospital ${name} in ${city}`);
    res.json({ id: rows[0].id, ...req.body });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const updateHospital = async (req, res) => {
  const { name, city, address, contact, email } = req.body;
  try {
    await pool.query(
      'UPDATE hospitals SET name = $1, city = $2, address = $3, contact = $4, email = $5 WHERE id = $6',
      [name, city, address || '', contact, email || '', req.params.id]
    );
    await createLogInternal('Update Hospital', `Updated hospital data for ${name} (ID: ${req.params.id})`);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const deleteHospital = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT name FROM hospitals WHERE id = $1', [req.params.id]);
    const hospitalName = rows.length > 0 ? rows[0].name : 'Unknown';
    await pool.query('DELETE FROM hospitals WHERE id = $1', [req.params.id]);
    await createLogInternal('Remove Hospital', `Deleted hospital ${hospitalName} (ID: ${req.params.id})`);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

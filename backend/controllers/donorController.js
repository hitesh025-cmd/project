import pool from '../config.js';
import { createLogInternal } from './logController.js';

export const getDonors = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM donors');
    res.json(rows.map(d => ({ ...d, available: !!d.available })));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const createDonor = async (req, res) => {
  const { name, bloodGroup, city, contact, lastDonationDate, available } = req.body;
  try {
    const { rows } = await pool.query(
      'INSERT INTO donors (name, "bloodGroup", city, contact, "lastDonationDate", available) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
      [name, bloodGroup, city, contact, lastDonationDate || null, available !== false]
    );
    await createLogInternal('Add Donor', `Added donor ${name} (${bloodGroup})`);
    res.json({ id: rows[0].id, ...req.body });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const updateDonor = async (req, res) => {
  const { name, bloodGroup, city, contact, lastDonationDate, available } = req.body;
  try {
    await pool.query(
      'UPDATE donors SET name = $1, "bloodGroup" = $2, city = $3, contact = $4, "lastDonationDate" = $5, available = $6 WHERE id = $7',
      [name, bloodGroup, city, contact, lastDonationDate || null, !!available, req.params.id]
    );
    await createLogInternal('Update Donor', `Updated donor ${name} (ID: ${req.params.id})`);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const deleteDonor = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT name FROM donors WHERE id = $1', [req.params.id]);
    const donorName = rows.length > 0 ? rows[0].name : 'Unknown';
    await pool.query('DELETE FROM donors WHERE id = $1', [req.params.id]);
    await createLogInternal('Remove Donor', `Deleted donor ${donorName} (ID: ${req.params.id})`);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

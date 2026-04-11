import pool from '../config.js';
import { createLogInternal } from './logController.js';

export const getInventory = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM inventory');
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const updateInventory = async (req, res) => {
  const { units } = req.body;
  try {
    await pool.query('UPDATE inventory SET units = $1 WHERE "bloodGroup" = $2', [units, req.params.bloodGroup]);
    await createLogInternal('Inventory Update', `Updated stock for ${req.params.bloodGroup} to ${units} units`);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

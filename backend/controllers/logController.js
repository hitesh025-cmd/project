import pool from '../config.js';

export const getLogs = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM activity_logs ORDER BY "createdAt" DESC LIMIT 50');
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// Internal utility to create a log entry from within other controllers
export const createLogInternal = async (action, details, adminUser = 'System Admin') => {
  try {
    await pool.query(
      'INSERT INTO activity_logs (action, details, "adminUser") VALUES ($1, $2, $3)',
      [action, details, adminUser]
    );
  } catch (e) {
    console.error('Logging error:', e.message);
  }
};

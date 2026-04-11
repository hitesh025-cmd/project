import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { initDb } from './config.js';

import donorRoutes from './routes/donorRoutes.js';
import requestRoutes from './routes/requestRoutes.js';
import inventoryRoutes from './routes/inventoryRoutes.js';
import hospitalRoutes from './routes/hospitalRoutes.js';
import logRoutes from './routes/logRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from the Vite build directory
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Init DB
initDb();

// --- API Routes ---
app.use('/api/donors', donorRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/hospitals', hospitalRoutes);
app.use('/api/logs', logRoutes);

// Catch-all route to serve the React app for any deep-linked routes
app.get('/{*splat}', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

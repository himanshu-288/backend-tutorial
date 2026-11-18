import express from 'express';
import mongoose from 'mongoose';
import api from './routes/api.js';
import User from './models/User.js';

const app = express();
app.use(express.json({ limit: '32kb' }));
app.get('/', (_req, res) => res.json({ service: 'Backend Tutorial', databaseConnected: mongoose.connection.readyState === 1 }));
app.use('/api/v1', api);
app.use((_req, res) => res.status(404).json({ error: 'Route not found.' }));
app.use((err, _req, res, _next) => {
  if (err.code === 11000) return res.status(409).json({ error: 'Username or email already registered.' });
  if (err.name === 'ValidationError' || err.name === 'CastError') return res.status(400).json({ error: 'Invalid field value or post ID.' });
  if (err.status === 400 || err.status === 413) return res.status(err.status).json({ error: 'Invalid or oversized JSON body.' });
  console.error(err.name);
  res.status(500).json({ error: 'Unexpected server error.' });
});

try {
  await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 10000 });
  await User.init();
  const port = Number(process.env.PORT || 4000);
  app.listen(port, '127.0.0.1', () => console.log('API running at http://127.0.0.1:' + port));
} catch (err) {
  console.error('Startup failed. Check MONGODB_URI, database credentials and network access.', err.name);
  await mongoose.disconnect();
  process.exitCode = 1;
}

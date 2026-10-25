import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import casesRouter from './routes/cases.js';

const app = express();
const port = Number(process.env.PORT || 5000);
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }));
app.use(express.json({ limit: '32kb' }));
app.get('/api/health', (_req, res) => res.json({ status: 'ok', database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' }));
app.use('/api/cases', casesRouter);
app.use((error, _req, res, _next) => {
  console.error(error);
  const status = error.status || (error.name === 'CastError' ? 400 : 500);
  res.status(status).json({ message: status === 500 ? 'An unexpected server error occurred.' : error.message });
});

async function start() {
  if (process.env.MONGODB_URI) {
    try { await mongoose.connect(process.env.MONGODB_URI); console.log('MongoDB connected'); }
    catch (error) { console.error('MongoDB connection failed:', error.message); process.exit(1); }
  } else console.warn('MONGODB_URI is not set. API routes requiring persistence will be unavailable.');
  app.listen(port, () => console.log(`AI Mystery Room API listening on ${port}`));
}
start();

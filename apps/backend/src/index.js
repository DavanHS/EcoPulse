import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import aqiRoutes from './routes/aqiRoutes.js';
import userRoutes from './routes/userRoutes.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.get('/', (req, res) => {
  res.json({ message: 'Eco-Pulse API Running 🚀', version: '1.0.0' });
});

app.use('/api/auth', authRoutes);
app.use('/api/aqi', aqiRoutes);
app.use('/api/user', userRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import productsRouter from './routes/products';
import categoriesRouter from './routes/categories';
import authRouter from './routes/auth';
import transactionsRouter from './routes/transactions';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/quincaillerie-stock')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Quincaillerie Stock Management API' });
});

// API routes
app.use('/api/products', productsRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/auth', authRouter);
app.use('/api/transactions', transactionsRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

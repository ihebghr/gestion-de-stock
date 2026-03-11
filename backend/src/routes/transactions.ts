import express from 'express';
import Transaction, { ITransaction } from '../models/Transaction';
import Product from '../models/Product';

const router = express.Router();

// Get all transactions
router.get('/', async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate('product', 'name reference')
      .sort({ createdAt: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching transactions', error });
  }
});

// Create transaction (sell product)
router.post('/', async (req, res) => {
  try {
    const { productId, type, quantity, customerName, notes } = req.body;
    
    // Find product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Check stock for sales
    if (type === 'sale') {
      if (product.quantity < quantity) {
        return res.status(400).json({ message: 'Insufficient stock' });
      }
      
      // Update product quantity
      product.quantity -= quantity;
    } else if (type === 'purchase') {
      // Add stock for purchases
      product.quantity += quantity;
    }
    
    await product.save();
    
    // Create transaction
    const transaction = new Transaction({
      product: productId,
      type,
      quantity,
      price: product.price,
      totalPrice: product.price * quantity,
      customerName,
      notes
    });
    
    const savedTransaction = await transaction.save();
    await savedTransaction.populate('product', 'name reference');
    
    res.status(201).json(savedTransaction);
  } catch (error) {
    res.status(400).json({ message: 'Error creating transaction', error });
  }
});

// Get transaction statistics
router.get('/stats', async (req, res) => {
  try {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfYear = new Date(today.getFullYear(), 0, 1);
    
    const [
      totalSales,
      monthlySales,
      yearlySales,
      recentTransactions
    ] = await Promise.all([
      // Total sales
      Transaction.aggregate([
        { $match: { type: 'sale' } },
        { $group: { _id: null, total: { $sum: '$totalPrice' }, count: { $sum: '$quantity' } } }
      ]),
      // Monthly sales
      Transaction.aggregate([
        { $match: { type: 'sale', createdAt: { $gte: startOfMonth } } },
        { $group: { _id: null, total: { $sum: '$totalPrice' }, count: { $sum: '$quantity' } } }
      ]),
      // Yearly sales
      Transaction.aggregate([
        { $match: { type: 'sale', createdAt: { $gte: startOfYear } } },
        { $group: { _id: null, total: { $sum: '$totalPrice' }, count: { $sum: '$quantity' } } }
      ]),
      // Recent transactions
      Transaction.find({ type: 'sale' })
        .populate('product', 'name reference')
        .sort({ createdAt: -1 })
        .limit(10)
    ]);
    
    res.json({
      totalSales: totalSales[0] || { total: 0, count: 0 },
      monthlySales: monthlySales[0] || { total: 0, count: 0 },
      yearlySales: yearlySales[0] || { total: 0, count: 0 },
      recentTransactions
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching transaction stats', error });
  }
});

export default router;

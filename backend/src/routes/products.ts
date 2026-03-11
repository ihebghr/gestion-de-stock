import express from 'express';
import Product, { IProduct } from '../models/Product';
import { authenticateToken, requireAdmin, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Get all products (public)
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    let query: any = {};
    
    if (category) {
      query.category = category;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { reference: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    const products = await Product.find(query).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error });
  }
});

// Get low stock products (protected)
router.get('/low-stock', authenticateToken, async (req, res) => {
  try {
    const products = await Product.find({
      $expr: { $lte: ['$quantity', '$minQuantity'] }
    }).sort({ quantity: 1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching low stock products', error });
  }
});

// Get single product (public)
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product', error });
  }
});

// Create product (admin only)
router.post('/', authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const productData = req.body;
    
    // Check if reference already exists
    const existingProduct = await Product.findOne({ reference: productData.reference });
    if (existingProduct) {
      return res.status(400).json({ message: 'Product reference already exists' });
    }
    
    const product = new Product(productData);
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ message: 'Error creating product', error });
  }
});

// Create multiple products (admin only)
router.post('/bulk', authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const productsData = req.body;
    
    // Check for duplicate references
    const references = productsData.map((p: any) => p.reference);
    const existingProducts = await Product.find({ reference: { $in: references } });
    
    if (existingProducts.length > 0) {
      const existingRefs = existingProducts.map(p => p.reference);
      return res.status(400).json({ 
        message: 'Some product references already exist', 
        duplicates: existingRefs 
      });
    }
    
    const products = await Product.insertMany(productsData);
    res.status(201).json(products);
  } catch (error) {
    res.status(400).json({ message: 'Error creating products', error });
  }
});

// Update product (admin only)
router.put('/:id', authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: 'Error updating product', error });
  }
});

// Update stock quantity (admin only)
router.patch('/:id/stock', authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { quantity, operation } = req.body; // operation: 'add' or 'subtract'
    
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    if (operation === 'add') {
      product.quantity += quantity;
    } else if (operation === 'subtract') {
      if (product.quantity < quantity) {
        return res.status(400).json({ message: 'Insufficient stock' });
      }
      product.quantity -= quantity;
    } else {
      product.quantity = quantity;
    }
    
    await product.save();
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: 'Error updating stock', error });
  }
});

// Delete product (admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error });
  }
});

export default router;

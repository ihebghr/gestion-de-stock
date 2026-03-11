import express from 'express';
import Category, { ICategory } from '../models/Category';

const router = express.Router();

// Get all categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find().populate('parentCategory').sort({ name: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching categories', error });
  }
});

// Get single category
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id).populate('parentCategory');
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching category', error });
  }
});

// Create category
router.post('/', async (req, res) => {
  try {
    const categoryData = req.body;
    
    // Check if category name already exists
    const existingCategory = await Category.findOne({ name: categoryData.name });
    if (existingCategory) {
      return res.status(400).json({ message: 'Category name already exists' });
    }
    
    const category = new Category(categoryData);
    const savedCategory = await category.save();
    await savedCategory.populate('parentCategory');
    res.status(201).json(savedCategory);
  } catch (error) {
    res.status(400).json({ message: 'Error creating category', error });
  }
});

// Update category
router.put('/:id', async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('parentCategory');
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    res.json(category);
  } catch (error) {
    res.status(400).json({ message: 'Error updating category', error });
  }
});

// Delete category
router.delete('/:id', async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting category', error });
  }
});

export default router;

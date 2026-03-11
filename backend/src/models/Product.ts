import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  reference: string;
  category: string;
  description?: string;
  quantity: number;
  minQuantity: number;
  price: number;
  supplier?: string;
  location?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  reference: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['outils', 'quincaillerie', 'matériaux', 'électricité', 'plomberie', 'jardinage', 'sécurité', 'autre']
  },
  description: {
    type: String,
    trim: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  minQuantity: {
    type: Number,
    required: true,
    min: 0
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  supplier: {
    type: String,
    trim: true
  },
  location: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

export default mongoose.model<IProduct>('Product', ProductSchema);

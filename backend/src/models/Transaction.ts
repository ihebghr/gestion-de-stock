import mongoose, { Schema, Document } from 'mongoose';

export interface ITransaction extends Document {
  product: mongoose.Types.ObjectId;
  type: 'sale' | 'purchase' | 'adjustment';
  quantity: number;
  price: number;
  totalPrice: number;
  customerName?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema: Schema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  type: {
    type: String,
    enum: ['sale', 'purchase', 'adjustment'],
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  customerName: {
    type: String,
    trim: true
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

export default mongoose.model<ITransaction>('Transaction', TransactionSchema);

import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  description?: string;
  parentCategory?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  parentCategory: {
    type: Schema.Types.ObjectId,
    ref: 'Category'
  }
}, {
  timestamps: true
});

export default mongoose.model<ICategory>('Category', CategorySchema);

export interface Product {
  _id: string;
  name: string;
  reference: string;
  category: string;
  description?: string;
  quantity: number;
  minQuantity: number;
  price: number;
  supplier?: string;
  location?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  _id: string;
  name: string;
  description?: string;
  parentCategory?: Category;
  createdAt: string;
  updatedAt: string;
}

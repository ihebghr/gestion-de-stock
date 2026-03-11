# MongoDB Compass Setup Guide

## Connection Configuration

### Using MongoDB Compass with Your Stock Management App

1. **Open MongoDB Compass**
2. **Create New Connection**
3. **Connection String**: `mongodb://localhost:27017/quincaillerie-stock`

## Database Structure

Once connected, you'll see the following structure:

### Database: `quincaillerie-stock`

#### Collections:

1. **products**
```javascript
{
  _id: ObjectId,
  name: String,
  reference: String,
  category: String,
  description: String,
  quantity: Number,
  minQuantity: Number,
  price: Number,
  supplier: String,
  location: String,
  createdAt: Date,
  updatedAt: Date
}
```

2. **categories**
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  parentCategory: ObjectId,
  createdAt: Date,
  updatedAt: Date
}
```

## Sample Data Queries

### Insert Sample Products
```javascript
// Switch to products collection and use Insert Document
{
  "name": "Marteau de charpentier",
  "reference": "OUT-001",
  "category": "outils",
  "description": "Marteau professionnel en bois",
  "quantity": 15,
  "minQuantity": 5,
  "price": 25.99,
  "supplier": "Bricolo Pro",
  "location": "Allée A, Rayon 1"
}
```

### Insert Sample Categories
```javascript
// Switch to categories collection
{
  "name": "outils",
  "description": "Outils de bricolage et professionnel"
}
```

## Useful Queries in Compass

### Find Low Stock Products
```javascript
{ $expr: { $lte: ["$quantity", "$minQuantity"] } }
```

### Find Products by Category
```javascript
{ "category": "outils" }
```

### Search Products by Name
```javascript
{ "name": { $regex: "marteau", $options: "i" } }
```

## Indexes for Performance

Create these indexes in Compass for better performance:

1. **Products Collection**:
   - Index on `reference` (unique)
   - Index on `category`
   - Index on `name` (text search)

2. **Categories Collection**:
   - Index on `name` (unique)

## Monitoring Your Data

With Compass you can:
- ✅ View real-time data changes
- ✅ Execute queries and see results
- ✅ Monitor database performance
- ✅ Create and manage indexes
- ✅ Export/import data
- ✅ Visualize data relationships

## Troubleshooting

If connection fails:
1. Ensure MongoDB service is running
2. Check if port 27017 is available
3. Verify MongoDB is installed locally
4. Try connection string: `mongodb://127.0.0.1:27017/quincaillerie-stock`

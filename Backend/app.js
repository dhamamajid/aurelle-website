const express = require('express');
const mongoose = require('mongoose');
const app = express();
const morgan = require('morgan');

require('dotenv').config({ path: require('path').join(__dirname, '.env') });

const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const categoryRoutes = require('./routes/categories');
const userRoutes = require('./routes/users');
const couponRoutes = require('./routes/coupons');

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('tiny'));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

const apiUrl = process.env.API_URL || '/api/v1';
const mongoUri = process.env.MONGODB_URI || process.env.CONNECTION_STRING || 'mongodb://127.0.0.1:27017/aurelle';

if (mongoUri.includes('<username>') || mongoUri.includes('<password>')) {
  console.error('MongoDB connection failed because the URI in Backend/.env contains placeholder values.');
  console.error('Replace <username> and <password> with your Atlas credentials in Backend/.env.');
  process.exit(1);
}

// Mount feature routes
app.use(`${apiUrl}/products`, productRoutes);
app.use(`${apiUrl}/orders`, orderRoutes);
app.use(`${apiUrl}/categories`, categoryRoutes);
app.use(`${apiUrl}/category`, categoryRoutes);
app.use(`${apiUrl}/users`, userRoutes);
app.use(`${apiUrl}/coupons`, couponRoutes);

app.get(`${apiUrl}/health`, (req, res) => {
  res.json({
    success: true,
    message: 'Backend is running and connected to MongoDB',
    db: 'aurelle-database',
    collection: 'products'
  });
});

// Return a friendly response if JSON is invalid
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      error: 'Invalid JSON payload. Check your request body in Postman.',
      success: false
    });
  }
  next(err);
});

// Connect to MongoDB and start server
mongoose
  .connect(mongoUri)
  .then(() => {
    console.log('Connected to MongoDB');

    app.listen(3000, () => {
      console.log('Server is running http://localhost:3000');
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message || err);
    process.exit(1);
  });
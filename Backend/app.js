const express = require('express');
const mongoose = require('mongoose');
const app = express();
const morgan = require('morgan');

require('dotenv').config();

// Import the Product model
const Product = require('./models/product');

// Import the Order model
const Order = require('./models/order');

// Import the Category model
const Category = require('./models/catagory');

// Import the User model
const User = require('./models/user');

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('tiny'));

const apiUrl = process.env.API_URL || '/api/v1';
const mongoUri = process.env.MONGODB_URI || process.env.CONNECTION_STRING || 'mongodb://127.0.0.1:27017/aurelle';

if (mongoUri.includes('<username>') || mongoUri.includes('<password>')) {
  console.error('MongoDB connection failed because the URI in Backend/.env contains placeholder values.');
  console.error('Replace <username> and <password> with your Atlas credentials in Backend/.env.');
  process.exit(1);
}

// Define all routes BEFORE connecting to MongoDB
// http://localhost:3000/api/v1/products
app.get(`${apiUrl}/products`, (req, res) => {
    Product.find()
      .then((products) => res.json(products))
      .catch((err) => res.status(500).json({ error: err.message, success: false }));
});

app.post(`${apiUrl}/products`, (req, res) => {
    const product = new Product({
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: req.body.image,
        images: req.body.images || [],
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        isFeatured: req.body.isFeatured,
        dateCreated: req.body.dateCreated || new Date()
    });
    product.save()
        .then((createdProduct) => {
            res.status(201).json(createdProduct);
        })
        .catch((err) => {
            res.status(400).json({ 
                error: err.message,
                success: false
             });
        });
});

app.get(`${apiUrl}/health`, (req, res) => {
  res.json({
    success: true,
    message: 'Backend is running and connected to MongoDB',
    db: 'aurelle-database',
    collection: 'products'
  });
});

// http://localhost:3000/api/v1/orders
app.get(`${apiUrl}/orders`, (req, res) => {
    Order.find()
      .populate('orderItems.product')
      .populate('user')
      .then((orders) => res.json(orders))
      .catch((err) => res.status(500).json({ error: err.message, success: false }));
});

app.post(`${apiUrl}/orders`, (req, res) => {
    const order = new Order({
        orderItems: req.body.orderItems,
        shippingAddress1: req.body.shippingAddress1,
        shippingAddress2: req.body.shippingAddress2,
        city: req.body.city,
        zip: req.body.zip,
        country: req.body.country,
        phone: req.body.phone,
        status: req.body.status || 'Pending',
        totalPrice: req.body.totalPrice,
        user: req.body.user,
        dateOrdered: req.body.dateOrdered || new Date()
    });
    order.save()
        .then((createdOrder) => {
            res.status(201).json(createdOrder);
        })
        .catch((err) => {
            res.status(400).json({ 
                error: err.message,
                success: false
             });
        });
});

// http://localhost:3000/api/v1/categories
app.get(`${apiUrl}/categories`, (req, res) => {
    Category.find().sort({ displayOrder: 1 })
      .then((categories) => res.json(categories))
      .catch((err) => res.status(500).json({ error: err.message, success: false }));
});

app.post(`${apiUrl}/categories`, (req, res) => {
    const category = new Category({
        name: req.body.name,
        color: req.body.color,
        icon: req.body.icon,
        image: req.body.image,
        description: req.body.description,
        isFeatured: req.body.isFeatured || false,
        displayOrder: req.body.displayOrder || 0,
        isActive: req.body.isActive !== false,
        dateCreated: req.body.dateCreated || new Date()
    });
    category.save()
        .then((createdCategory) => {
            res.status(201).json(createdCategory);
        })
        .catch((err) => {
            res.status(400).json({ 
                error: err.message,
                success: false
             });
        });
});

// http://localhost:3000/api/v1/users
app.get(`${apiUrl}/users`, (req, res) => {
    User.find().select('-passwordHash')
      .then((users) => res.json(users))
      .catch((err) => res.status(500).json({ error: err.message, success: false }));
});

app.post(`${apiUrl}/users`, (req, res) => {
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        passwordHash: req.body.passwordHash,
        street: req.body.street,
        city: req.body.city,
        zip: req.body.zip,
        country: req.body.country,
        phone: req.body.phone,
        isAdmin: req.body.isAdmin || false,
        isActive: req.body.isActive !== false,
        dateCreated: req.body.dateCreated || new Date()
    });
    user.save()
        .then((createdUser) => {
            res.status(201).json(createdUser);
        })
        .catch((err) => {
            res.status(400).json({ 
                error: err.message,
                success: false
             });
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
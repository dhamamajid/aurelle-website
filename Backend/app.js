const express = require('express');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');

// middleware
app.use(bodyParser.json());
app.use(morgan('tiny'));

require('dotenv').config();

const apiUrl = process.env.API_URL || '/api/v1';
const mongoUri = process.env.MONGODB_URI || process.env.CONNECTION_STRING || 'mongodb://127.0.0.1:27017/aurelle';

if (mongoUri.includes('<username>') || mongoUri.includes('<password>')) {
  console.error('MongoDB connection failed because the URI in Backend/.env contains placeholder values.');
  console.error('Replace <username> and <password> with your Atlas credentials in Backend/.env.');
  process.exit(1);
}

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

// http://localhost:3000/api/v1/products
app.get(`${apiUrl}/products`, (req, res) => {
    const products = [
        { id: 1, name: 'Everlasting Vanilla', image: "path/to/product1.png", price: 9.99 }
    ];
    res.send(products);
});

app.post(`${apiUrl}/products`, (req, res) => {
    const newProduct = req.body; // Assuming the product data is sent in the request body
    console.log(newProduct); // Log the new product data to the console
    res.send(newProduct); // Send the new product data back in the response
});
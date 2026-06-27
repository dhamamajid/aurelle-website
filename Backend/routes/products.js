const express = require('express');
const Product = require('../models/product');

const router = express.Router();

router.get('/', (req, res) => {
  Product.find()
    .then((products) => res.json(products))
    .catch((err) => res.status(500).json({ error: err.message, success: false }));
});

router.post('/', (req, res) => {
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

  product
    .save()
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

module.exports = router;

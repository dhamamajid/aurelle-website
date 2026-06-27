const express = require('express');
const Order = require('../models/order');

const router = express.Router();

router.get('/', (req, res) => {
  Order.find()
    .populate('orderItems.product')
    .populate('user')
    .then((orders) => res.json(orders))
    .catch((err) => res.status(500).json({ error: err.message, success: false }));
});

router.post('/', (req, res) => {
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

  order
    .save()
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

module.exports = router;

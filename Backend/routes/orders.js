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
    customerName: req.body.customerName,
    customerEmail: req.body.customerEmail,
    customerNote: req.body.customerNote,
    status: req.body.status || 'Pending',
    totalPrice: req.body.totalPrice,
    user: req.body.user,
    couponCode: req.body.couponCode,
    couponDiscount: req.body.couponDiscount,
    paymentMethod: req.body.paymentMethod,
    customerUpdateMessage: req.body.customerUpdateMessage,
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

router.put('/:id', async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        status: req.body.status,
        customerUpdateMessage: req.body.customerUpdateMessage,
        paymentMethod: req.body.paymentMethod
      },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({ success: true, order: updatedOrder });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

module.exports = router;

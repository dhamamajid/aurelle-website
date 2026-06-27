const express = require('express');
const User = require('../models/user');

const router = express.Router();

router.get('/', (req, res) => {
  User.find()
    .select('-passwordHash')
    .then((users) => res.json(users))
    .catch((err) => res.status(500).json({ error: err.message, success: false }));
});

router.post('/', (req, res) => {
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

  user
    .save()
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

module.exports = router;

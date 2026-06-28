const express = require('express');
const Category = require('../models/category');

const router = express.Router();

router.get('/', (req, res) => {
  Category.find().sort({ displayOrder: 1 })
    .then((categories) => res.json(categories))
    .catch((err) => res.status(500).json({ error: err.message, success: false }));
});

router.post('/', (req, res) => {
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

  category
    .save()
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

router.delete('/:id', (req, res) => {
    Category.findByIdAndRemove(req.params.id).then((category) => {
        if (category) {
            return res.status(200).json({ success: true, message: 'the category is deleted!' });
        } else {
            return res.status(404).json({ success: false, message: 'category not found!' });
        }
    }).catch((err) => {
        return res.status(400).json({ success: false, error: err.message });
    })});

router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'category not found!' });
    }
    res.status(200).json(category);
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

module.exports = router;

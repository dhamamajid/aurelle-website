const express = require('express');
const Coupon = require('../models/coupon');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ dateCreated: -1 });
    res.json(coupons);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const coupon = new Coupon({
      code: req.body.code,
      discountType: req.body.discountType,
      discountValue: req.body.discountValue,
      expiresAt: req.body.expiresAt,
      isActive: req.body.isActive !== false,
      note: req.body.note,
      dateCreated: req.body.dateCreated || new Date()
    });

    const createdCoupon = await coupon.save();
    res.status(201).json(createdCoupon);
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updatedCoupon = await Coupon.findByIdAndUpdate(
      req.params.id,
      {
        code: req.body.code,
        discountType: req.body.discountType,
        discountValue: req.body.discountValue,
        expiresAt: req.body.expiresAt,
        isActive: req.body.isActive,
        note: req.body.note
      },
      { new: true }
    );

    if (!updatedCoupon) {
      return res.status(404).json({ success: false, message: 'Coupon not found' });
    }

    res.json({ success: true, coupon: updatedCoupon });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deletedCoupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!deletedCoupon) {
      return res.status(404).json({ success: false, message: 'Coupon not found' });
    }
    res.json({ success: true, message: 'Coupon deleted' });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

module.exports = router;

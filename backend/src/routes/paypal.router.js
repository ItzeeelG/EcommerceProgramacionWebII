const express = require('express');
const router = express.Router();
const { captureOrder, createOrder } = require('../controllers/paypal.controller.js');

router.post('/create-order', createOrder);
router.post('/capture-order', captureOrder);
module.exports = router;
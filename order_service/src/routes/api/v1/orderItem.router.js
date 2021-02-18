const express = require('express');
const router = express.Router();
const { postOrderItem, cancelOrderItem, getOrderItem } = require('../../../controllers/orderItem.controller.js');

router.get('/:id', getOrderItem);
router.post('/:id', postOrderItem);
router.get('/cancel/:id', cancelOrderItem);

module.exports = router;
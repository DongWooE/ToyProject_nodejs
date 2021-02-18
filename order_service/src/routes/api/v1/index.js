const express = require('express');
const router = express.Router();
const orderItemRouter = require('./orderItem.router');
const orderRouter = require('./order.router');

router.use('/order', orderRouter);
router.use('/orderItem', orderItemRouter);

module.exports = router;
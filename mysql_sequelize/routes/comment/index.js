const { Router } = require('express');
const router = Router();

const answerRouter = require('./answer');
const boardRouter = require('./board');

router.use('/answer', answerRouter);
router.use('/board', boardRouter);

module.exports = router;

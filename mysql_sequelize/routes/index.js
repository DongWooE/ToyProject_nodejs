const { Router } = require('express');
const router = Router();

const authRouter = require('./auth/auth');
const boardRouter = require('./board');
const boardCommentRouter = require('./comment/board');
const answerCommentRouter = require('./comment/answer');
const searchRouter = require('./search');
const answerRouter = require('./answer');

router.use('/auth', authRouter);
router.use('/boards', boardRouter);
router.use('/comments/answers', answerCommentRouter);
router.use('/comments/boards', boardCommentRouter);
router.use('/answers', answerRouter);
router.use('/search', searchRouter);

module.exports = router;
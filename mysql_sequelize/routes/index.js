const { Router } = require('express');
const router = Router();

const authRouter = require('./auth');
const boardRouter = require('./board');
const boardCommentRouter = require('./comment/board');
const answerCommentRouter = require('./comment/answer');
const searchRouter = require('./search');
const answerRouter = require('./answer');
const likeRouter = require('./likes');

router.use('/auth', authRouter);
router.use('/boards', boardRouter);
router.use('/comments/answers', answerCommentRouter);
router.use('/comments/boards', boardCommentRouter);
router.use('/answers', answerRouter);
router.use('/search', searchRouter);
router.use('/likes', likeRouter);

//테스트 코드
const {verifyToken } = require('./middleware/verify')

router.use('/test', verifyToken,(req,res,next)=>{
    console.log(`이 사람의 이름은 : ${res.locals.user}입니다`);
})

module.exports = router;
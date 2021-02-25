const express = require('express');
const router = express.Router();
const {verifyToken} = require('../../middleware/verify');
const {getComments, postComment, putComment, deleteComment} = require('../../../controller/comment_answer.router')

router.get('/:userID/:answerID', getComments)
router.post('/:userID/:answerID', postComment);
router.put('/:userID/:answerID/:commentID',putComment);
router.delete('/:userID/:answerID/:commentID', deleteComment);

module.exports = router;
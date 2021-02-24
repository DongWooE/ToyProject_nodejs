const express = require('express');
const {verifyToken} = require('../middleware/verify');
const router = express.Router();
const {postAnswer,putAnswer,deleteAnswer,postReco} = require('../../controller/answer.router');

router.post('/:userID/:postID' ,postAnswer);        //새로운 답변을 생성
router.route('/:userID/:postID/:answerID')                      
.put(putAnswer)                                         //답변 변경
.delete(deleteAnswer);                                  //답변 삭제

module.exports = router;
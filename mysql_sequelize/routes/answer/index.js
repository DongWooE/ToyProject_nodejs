const express = require('express');
const {verifyToken} = require('../middleware/verify');
const router = express.Router();
const {postAnswer,patchAnswer,deleteAnswer,postReco} = require('../../controller/answer.router');

router.post('/:id/new',verifyToken, postAnswer);        //새로운 답변을 추가
router.route('/:key', verifyToken)                      
.post(postReco)                                         //추천수 post
.patch(patchAnswer)                                     //답변 변경
.delete(deleteAnswer);                                  //답변 삭제

module.exports = router;
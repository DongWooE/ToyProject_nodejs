const express = require('express');
const {verifyToken} = require('../middleware/verify');
const router = express.Router();
const {postAnswer,patchAnswer,deleteAnswer,postReco} = require('../../controller/answer.router');

router.post('/:id/new' ,postAnswer);        //새로운 답변을 추가
router.route('/:id')                      
.post(postAnswer)                                       // 새로운 답변 생성 ( id : userID)
.patch(patchAnswer)                                     //답변 변경
.delete(deleteAnswer);                                  //답변 삭제

module.exports = router;
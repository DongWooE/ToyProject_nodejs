const express = require('express');
const router = express.Router();
const { postAnswerReco, postBoardReco } = require('../../controller/like.router')

router.post('/board/:userID/:postID',postBoardReco)
router.post('/answer/:userID/:answerID', postAnswerReco)     

module.exports = router;
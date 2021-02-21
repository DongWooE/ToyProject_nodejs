const express = require('express');
const router = express.Router();
const {verifyToken} = require('../middleware/verify');
const {getBoard, getBoards, postBoard, patchBoard, deleteBoard, postReco} = require('../../controller/board.router')

router.get('/',getBoards);
router.post('/new/id', postBoard);
router.route('/:id', verifyToken)
.post(postReco)
.patch(patchBoard)
.delete(deleteBoard);
router.get('/:userID/:postID',getBoard);

module.exports = router;
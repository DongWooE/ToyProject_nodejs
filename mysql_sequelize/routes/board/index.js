const express = require('express');
const router = express.Router();
const {verifyToken} = require('../middleware/verify');
const {getBoard, getBoards, postBoard, putBoard, deleteBoard, postReco} = require('../../controller/board.router')

router.get('/', getBoards);
router.post('/:userID',postBoard)        // board 생성   ( id : userID)
router.route('/:userID/:postID')
.get(getBoard)          // 특정한 board 값을 받아온다   ( id : boardID)
.put(putBoard)          // board 수정   ( id : boardID)
.delete(deleteBoard);   // board 삭제   ( id : boardID)

module.exports = router;
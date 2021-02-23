const express = require('express');
const router = express.Router();
const {verifyToken} = require('../middleware/verify');
const {getBoard, getBoards, postBoard, patchBoard, deleteBoard, postReco} = require('../../controller/board.router')

router.get('/', getBoards);
router.post('/', postBoard);
router.route('/:id')
.get(getBoard)          // 특정한 board 값을 받아온다
.patch(patchBoard)      // board 수정
.delete(deleteBoard);   // board 삭제

module.exports = router;
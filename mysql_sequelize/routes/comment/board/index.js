const express = require('express');
const router = express.Router();
const { verifyToken } = require('../../middleware/verify');
const {getComments, postComment, patchComment, deleteComment} = require('../../../controller/comment_board.router')

router.route('/:id/:class',verifyToken,)
.get(getComments)
.post(postComment)
.patch(patchComment)
.delete(deleteComment);

module.exports = router;
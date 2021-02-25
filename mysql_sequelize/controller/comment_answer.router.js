const { User, Answer, AnswerComment } = require('../models');
const { findByPk } = require('../models/user');

const getComments = (async(req,res,next) =>{
    const { userID: answerCommenter, answerID  } = req.params;
    const { limit , offset } = req.query;
    try{
        const { count , rows } = await AnswerComment.findAndCountAll({ where : {answerID , answerCommenter }});
        if( count == 0 ) {
            res.json({ state : "empty", message : "답변이 없음"});
            res.end();
        }
        res.json(rows);
    }catch(error){
        console.error(error);
        next(error);
    }
})

const postComment = (async(req,res,next)=>{
    const { userID, answerID } = req.params;
    const { commentContent } = req.body;
    try{
    const user = await User.findOne({ where : { userID }})
    const answer = await Answer.findOne({ where : { id : answerID }});
    const comment = await AnswerComment.create({
        commentContent,
        userID,
        answerID
    })
    user.addAnswerComments(comment);
    answer.addAnswerComments(comment);
    res.json({state : "commentSuccess"});
    }catch(error){
        console.error(error);
        next(error);
    }
})
const putComment = (async(req,res,next) =>{
    const { userID, answerID, commentID } = req.params;
    const { commentContent } = req.body;
    try{
        const comment = await AnswerComment.findByPk(commentID);
        if(comment.answerCommenter != userID) {
            res.json({ state : "notPermissioned"});
            next();
        }
        await comment.update({
            commentContent,
        })
        res.json({ state : "updateDone", message : "업데이트 완료됨"});
    }catch(error){
        console.error(error);
        next(error);
    }
})

const deleteComment = (async(req,res,next) =>{
    const { userID, answerID, commentID } = req.params;
    try{
        const user = await User.findByPk(userID);
        const answer = await Answer.findByPk(answerID);
        await AnswerComment.destroy({
            where : { id : commentID },
        })
        user.removeAnswerComments(commentID)
        answer.removeAnswerComments(commentID)
        res.json({state : "destroyDone", message : "삭제 완료됨"});
    }catch(error){
        console.error(error);
        next(error);
    }
});

module.exports = {putComment, deleteComment, getComments, postComment};
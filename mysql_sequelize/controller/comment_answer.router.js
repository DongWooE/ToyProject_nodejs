const { User, Answer, AnswerComment } = require('../models');

const getComments = (async(req,res,next) =>{
    try{
        const { limit , offset } = req.query;
        const { count , rows } = await AnswerComment.findAndCountAll({ where : {answerID : `${req.params.id}`, userID : `${res.locals.user}`, limit, offset}});
        if( count == 0 ) res.json({ state : "empty", message : "답변이 없음"});
        res.json(rows);
    }catch(error){
        console.error(error);
        next(error);
    }
})

const postComment = (async(req,res,next)=>{
    try{
    const { commentContent }= req.body;
    const user = await User.findOne({ where : { userID : `${res.locals.user}`}})
    const answer = await Answer.findOne({ where : {id : `${req.params.id}`}});
    
    const comment = await AnswerComment.create({
        commentContent,
    })
    user.addAnswerComments(comment);
    answer.addAnswerComments(comment);
    }catch(error){
        console.error(error);
        next(error);
    }
})
const patchComment = (async(req,res,next) =>{
    try{
        const { commentContent } = req.body;
        await AnswerComment.update({
            commentContent,
        },{
            where : { id : `${req.params.class}`},

        })
        res.json({ state : "updateDone", message : "업데이트 완료됨"});
    }catch(error){
        console.error(error);
        next(error);
    }
})

const deleteComment = (async(req,res,next) =>{
    try{
        await AnswerComment.destroy({
            where : { id : `${req.params.class}`},
        })
        res.json({state : "destroyDone", message : "삭제 완료됨"});
    }catch(error){
        console.error(error);
        next(error);
    }

});

module.exports = {patchComment, deleteComment, getComments, postComment};
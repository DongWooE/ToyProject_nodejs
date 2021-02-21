const { User, Board, BoardComment } = require('../models');

const getComments = (async(req,res,next) =>{
    try{
        const { limit , offset } = req.query;
        const { count , rows } = await BoardComment.findAndCountAll({ where : {boardID : `${req.params.id}`, userID : `${res.locals.user}`, limit, offset}});
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
    const board = await Board.findOne({ where : {id : `${req.params.id}`}});
    const comment = await BoardComment.create({
        commentContent,
    })
    user.addBoardComments(comment);
    board.addBoardComments(comment);
    
    }catch(error){
        console.error(error);
        next(error);
    }
})

const patchComment = (async(req,res,next) =>{
    try{
        const { commentContent } = req.body;
        await BoardComment.update({
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
        await BoardComment.destroy({
            where : { id : `${req.params.class}`},
        })
        res.json({state : "destroyDone", message : "삭제 완료됨"});
    }catch(error){
        console.error(error);
        next(error);
    }

});

module.exports = {getComments, postComment, patchComment, deleteComment};
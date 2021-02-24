const { User, Board, BoardLike, Answer, AnswerLike} = require("../models")

const postBoardReco = (async(req,res,next)=>{           //좋아요
    const { userID, postID } = req.params;
    const { recommend } = req.body;
    try{
        const like = await BoardLike.findOne({where : { userID , boardID : postID}})
        const board = await Board.findByPk(postID);
        if(!like){
            const user = await User.findByPk(userID);
            const newLike = await BoardLike.create({
                isAdd : true,
            })
            user.addBoardLikes(newLike);
            board.addBoardLikes(newLike);
            const newReco = board.bbsReco + (+recommend);
            board.update({ bbsReco : newReco});
            res.json({state : "LikedSuccess", message : "좋아요 또는 싫어요 작업 완료"});
        }
        else{
            if(like.isAdd){
                res.json({ state : "alreadyLiked", message : "이미 좋아요 또는 싫어요를 표시함"});
            }
        }
    }
    catch(err){
        console.error(err);
        next(err);
    } 
})

const postAnswerReco = (async(req,res,next) =>{
    const { userID, answerID } = req.params;
    const { recommend } = req.body;
    try{
    const like = await AnswerLike.findOne({where: { userID , answerID }});
    const answer =await Answer.findByPk(answerID);
    if(!answer) res.json({message : "answer is not existed"});
    if(!like){      //만약 like table이 존재하지않다면 새로 만들어준다
        const user = await User.findByPk(userID);
        const newLike = await AnswerLike.create({
            isAdd : true,
        })
        user.addAnswerLikes(newLike);
        answer.addAnswerLikes(newLike);
        const newReco = answer.answerReco + (+recommend);
        answer.update({ answerReco : newReco});
        res.json({ state : "LikedSuccess", message : "좋아요 또는 싫어요 작업 완료"});
    } 
    else{
        if(like.isAdd){        //만약 기존에 like를 찍었다면
            res.json({ state : "alreadyLiked", message: "이미 좋아요 또는 싫어요를 표시함"});
        }
    }
    }catch(error){
        console.error(error);
        next(error);
    }
})

module.exports = {postBoardReco, postAnswerReco};
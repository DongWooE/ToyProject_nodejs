const express = require('express');
const { User, Board, Answer, AnswerLike } = require('../../models');
const { verifyToken } = require('../auth/middleware');

const router = express.Router();

router.post('/:id/new',verifyToken, async(req,res,next) =>{      //새로운 답변을 추가
    try{
    const user = await User.findOne({ where : { id : `${res.locals.user}`} });
    const board = await Board.findOne({ where : { id : `${req.params.id}`}});

    const answer =  { answerContent } = req.body;
    await Answer.create({
        answerContent,
    });
    await user.addAnswer(answer);
    await board.addAnswer(board);
    
    return res.json({ key : `${answer.id}`,state: "answerSuccess", message : "답변이 잘 입력됨"});      //여기서 key값을 잘 가지고 있어야함
    }catch(error){
        console.error(error);
        next(error);
    }
});


router.route('/:key', verifyToken)        //:key값으로 comment의 아이디값을 받는다
.post(async(req,res,next) =>{
    const {recommend} = req.body;
    try{
    const like = await AnswerLike.findOne({ where: { userID : `${res.locals.user}`, answerID : `${req.params.key}`}});
    const answer =await Answer.findOne({ where : { id : `${req.params.key}`} }); 

    if(!like){      //만약 like table이 존재하지않다면 새로 만들어준다
        const user = await User.findOne({ where : { userID : `${res.locals.user}`}});

        const newLike = await AnswerLike.create({
            isAdd : true,
        })
        
        user.addAnswerLike(newLike);
        answer.addAnswerLike(newLike);
        const exReco = answer.answerReco;           //좋아요 또는 싫어요를 표시함
        answer.answerReco = exReco + (+recommend); 
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
.patch(async(req,res,next) =>{
    try{
        const { answerContent } = req.body;
        const result = await Answer.findOne({ id : `${req.params.key}`});
        result.update({
            answerContent,
        });
        res.json({ state : "updateDone", message : " 업데이트 완료 "});

    }catch(error){
        console.error(error);
        next(error);
    }

})
.delete(async(req,res,next) =>{
    try{
        const like = await AnswerLike.findAll({ where : { answerID :`${req.params.key}`}});
        const comment = await AnswerComment.findAll({ where : {answerID : `${req.params.key}`}});
        const answer = await Answer.findOne({ where : {id : `${req.params.key}`}});
        
        answer.removeAnswerComments(comment);
        answer.removeAnswerLikes(like);

        res.json({state : "destroydone", message : "삭제완료" });

    }catch(error){
        console.error(error);
        next(error);
    }


});


module.exports = router;
const { User, Board, Answer, AnswerLike } = require('../models');

const postAnswer =  (async(req,res,next) =>{      //새로운 답변을 추가
    const { userID, postID } = req.params;
    const { answerContent } = req.body;
    try{
    const user = await User.findByPk(userID);
    if(!user) res.status(401);
    const board = await Board.findByPk(postID);
    if(!board) res.status(401);
    const answer = await Answer.create({
        answerContent,
        answerer : userID,
        boardID : postID,
    });
    await user.addAnswer(answer);
    await board.addAnswer(answer);
    return res.json({ key : `${answer.id}`,state: "answerSuccess", message : "답변이 잘 입력됨"});      //여기서 key값을 잘 가지고 있어야함
    }catch(error){
        console.error(error);
        next(error);
    }
});

const postReco = (async(req,res,next) =>{
    const { recommend } = req.body;
    try{
    const like = await AnswerLike.findOne({where: { userID : `${res.locals.user}`, answerID : `${req.params.key}`}});
    const answer =await Answer.findOne({where : { id : `${req.params.key}`} });
    if(!answer) res.json({message : "answer is not existed"});
    if(!like){      //만약 like table이 존재하지않다면 새로 만들어준다
        const user = await User.findOne({where : { userID : `${res.locals.user}`}});
        const newLike = await AnswerLike.create({
            isAdd : true,
        })
        user.addAnswerLikes(newLike);
        answer.addAnswerLikes(newLike);
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

const putAnswer = (async(req,res,next) =>{
    const { userID, postID, answerID } = req.params;
    const { answerContent } = req.body;
    try{
        const answer = await Answer.findByPk(answerID);
        if(!answer) res.json({ state : "notExisted"});
        if(answer.answerer != userID) res.json({ state : "notPermissioned"});
        await answer.update({
            answerContent,
        })
        const user = await User.findByPk(userID);
        const board = await Board.findByPk(postID);
        user.setAnswers(answer);
        board.setAnswers(answer);
        res.json({ state : "answerChanged", message : " 업데이트 완료 "});
    }catch(error){
        console.error(error);
        next(error);
    }
})

const deleteAnswer = (async(req,res,next) =>{
    const { userID, postID, answerID } = req.params;
    try{
        const answer = await Answer.findByPk(answerID);
        if(!answer) res.json({ state : "notExisted"});
        if(answer.answerer != userID) res.json({ state : "notPermissioned"});
        answer.removeAnswerComments();
        answer.removeAnswerLikes();
        const board = await Board.findByPk(postID)
        const user = await User.findByPk(userID)
        board.removeAnswer(answer);
        user.removeAnswer(answer);
        answer.destroy();
        res.json({state : "destroydone", message : "삭제완료" });
    }catch(error){
        console.error(error);
        next(error);
    }
});


module.exports = { postAnswer, putAnswer, deleteAnswer, postReco};
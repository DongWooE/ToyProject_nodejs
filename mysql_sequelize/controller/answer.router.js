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
    await user.addAnswers(answer);
    await board.addAnswers(answer);
    return res.json({ key : `${answer.id}`,state: "answerSuccess", message : "답변이 잘 입력됨"});      //여기서 key값을 잘 가지고 있어야함
    }catch(error){
        console.error(error);
        next(error);
    }
});


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


module.exports = { postAnswer, putAnswer, deleteAnswer};
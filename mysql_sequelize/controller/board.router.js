const { User, Board, Hashtag, Answer, BoardLike, BoardComment, AnswerComment } = require('../models');

const getBoards = (async(req,res,next)=>{
    try{
        const { limit, offset } = req.query;    // 페이징
        const { count, rows} = await Board.findAndCountAll({ limit, offset});       //페이징으로 나눠서 갖고 오기
        if(count == 0) res.json({ state : "Empty"});   
        res.json(rows);
    }
    catch(err){
        console.error(err);
        next(err);
    }
});

const postBoard = (async(req,res,next)=>{
    try{
        const user = await User.findOne({where : {userID : req.params.userID}});
        if(!user) res.json({state: "notExisted"});
        const { bbsTitle, bbsContent, hashTagContent} = req.body;
        const board = await Board.create({
            bbsTitle,
            bbsContent,
            hashTagContent,
            });
        const hashtags = hashTagContent.match(/#[^\s#]*/g);
        if(hashtags){
            const result = await Promise.all(
                hashtags.map(tag => {
                    return Hashtag.findOrCreate({
                        where : { Content : tag.slice(1).toLowerCase()}
                    })
                })
            )
            await board.addHashtags(result.map(r => r[0]));
        }
        await user.addBoards(board);
        return res.json({state : "boardSuccess"});
        }
    catch(err){
        console.error(err);
        next(err);
    }
});

const putBoard = (async(req,res,next)=>{
    const {bbsTitle, bbsContent, hashTagContent} = req.body;
    const { userID, postID } = req.params; 
    try{
        const board = await Board.findOne({ where : { id : postID }});
        if(!board) res.json({ state : "notExisted"});
        if(board.boarder != userID) res.json({ state : "notPermissioned"});
        await board.update({
            bbsTitle,
            bbsContent,
            hashTagContent,
        })
        const user = await User.findOne({ where : { userID}});
        user.setBoards(board);
        return res.json({state: "boardChanged"});
    }
    catch(err){
        console.error(err);
        next(err);
    }
})

const deleteBoard = (async(req,res,next)=>{
    const { userID, postID } = req.params;
    try{
        const board = await Board.findOne({ where : { id : postID}});
        if(board.boarder != userID) res.json({ state : "notPermissioned" });
        const user = await User.findOne({ where : {userID}});
        const answer = await Answer.findOne({ where : {boardID : postID}})
        if(answer){
        await answer.removeAnswerComments();
        await answer.removeAnswerLikes();
        }
        board.removeAnswers();
        board.removeBoardComments();
        board.removeBoardLikes();
        user.removeBoard(board);
        board.destroy();
        return res.json({state: "boardDeleted"});
    }
    catch(err){
        console.error(err);
        next(err);
    }
});

const getBoard = (async(req,res,next)=>{
    const { postID, userID } = req.params;
    try{
        const result = await Board.findOne({where : {id : postID}});
        const temp = result.bbsViews+1;
        result.update({
            bbsViews : temp,
        }); 
        const answers = await result.getAnswers();
        return res.json({board : result , answers : answers});
    }
    catch(err){
        console.error(err);
        next(err);
    }
})

module.exports = {getBoard, getBoards, postBoard, putBoard, deleteBoard};
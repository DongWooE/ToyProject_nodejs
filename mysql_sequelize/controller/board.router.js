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
        const user = await User.findOne({where : {userID : req.params.id}});
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

const postReco = (async(req,res,next)=>{           //좋아요
    const { recommend } = req.body;
    try{
        const like = await BoardLike.findOne({where : { userID : `${res.locals.user}`}, boardID : `${req.params.id}`})
        const board = await Board.findOne({where : {id : `${req.params.id}`}});
        
        if(!like){
            const user = await User.findOne({ where : {userID : `${res.locals.user}`}});
            const newLike = await BoardLike.create({
                isAdd : true,
            })
            user.addBoardLikes(newLike);
            board.addBoardLikes(newLike);
            const exReco = board.bbsReco;
            board.bbsReco = exReco + (+recommend);
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

const putBoard = (async(req,res,next)=>{
    const {bbsTitle, bbsContent, hashTagContent} = req.body;
    try{
        await Board.update({
            bbsTitle,
            bbsContent,
            hashTagContent,
        },{
            where : {id : req.params.id},
        })
        return res.json({state: "boardChanged"});
    }
    catch(err){
        console.error(err);
        next(err);
    }
})

const deleteBoard = (async(req,res,next)=>{
    const number = req.params.id;
    try{
        const board = await Board.findOne({ where : { id : number}});
        const answer = await Answer.findOne({ where : {boardID : number}})
        if(answer){
        await answer.removeAnswerComments();
        await answer.removeAnswerLikes();
        }
        board.removeAnswers();
        board.removeBoardComments();
        board.removeBoardLikes();
        board.destroy();
        return res.json({state: "boardDeleted"});
    }
    catch(err){
        console.error(err);
        next(err);
    }
});

const getBoard = (async(req,res,next)=>{
    try{
        const boardID = req.params.id;
        const result = await Board.findOne({where : {id : boardID}});
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

module.exports = {getBoard, getBoards, postReco, postBoard, putBoard, deleteBoard};
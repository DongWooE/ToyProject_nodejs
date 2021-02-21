const express = require('express');
const { User, Board, Hashtag, Answer, BoardLike, BoardComment, AnswerComment } = require('../../models');
const { verifyToken } = require('../auth/middleware');

const router = express.Router();


router.route('/')
.get(async(req,res,next)=>{
    try{
        const { limit, offset } = req.query;    // 페이징
        const temp = await Board.findAll({ limit, offset});       //페이징으로 나눠서 갖고 오기
        for(let item in temp){
            const count = await Board.count({
                include: [{
                    model: Answer,
                    where : { id : `${temp[item].dataValues.id}`}
                }]
            })
            temp[item].dataValues.answerCount = count;
        }
        res.json(temp);
    }
    catch(err){
        console.error(err);
        next(err);
    }
});

router.route('/new/:id')
.post(async(req,res,next)=>{
    const user = await User.findOne({where : {userID : `${req.params.id}`}});
    const { bbsTitle, bbsContent, hashTagContent} = req.body;
    try{
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

router.route('/:id')
.post( verifyToken,async(req,res,next)=>{           //좋아요
    
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

.patch( async(req,res,next)=>{
    const {bbsTitle, bbsContent} = req.body;
    try{
        await Board.update({
            bbsTitle,
            bbsContent,
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

.delete( async(req,res,next)=>{
    try{

        await Board.destroy({
            where: {id: req.params.id},
        })
        return res.json({state: "boardDeleted"});
    }
    catch(err){
        console.error(err);
        next(err);
    }

});

router.get('/:userID/:postID', async(req,res,next)=>{

    const boardID = req.params.postID;
    try{
        const result = await Board.findOne({where : {id : boardID}});
        console.log(result);
        if(req.params.userID != result.boarder){          // 본인이 아니면 조회수를 늘려줌
            const temp = result.bbsViews+1;
            result.update({
                bbsViews : temp,
            }); 
        }   

        //이제 답변들 불러와야함
        const answers = await result.getAnswers();
        
        //각각의 댓글수들도 계산해야함
        const count = await Board.count({
            include : [{
                model : BoardComment,
                where : { id : `${req.params.id}`}
            }]
        });
        await result.update({
            commentCount : count,
        })
            for( let item in answers){
                const count  = await Answer.count({
                    include : [{
                        model : AnswerComment,
                        where : { id : `${answers[item].dataValues.id}`}
                    }]
                })
                answers[item].dataValues.commentCount = count;
            }
        
        return res.json({board : result , answers : answers});
    }
    catch(err){
        console.error(err);
        next(err);
    }
})

module.exports = router;
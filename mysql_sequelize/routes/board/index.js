const express = require('express');
const { User, Board, Hashtag, Answer } = require('../../models');
const { verifyToken } = require('../auth/middleware');

const router = express.Router();


router.route('/')
.get(async(req,res,next)=>{
    try{
        const { limit, offset } = req.query;    // 페이징
        const temp = await Board.findAll({ limit, offset});       //페이징으로 나눠서 갖고 오기
        for(board in result){
            const num = await board.getAnswers().count();   //이게 될까?
            console.log(num);       //나중에 삭제할것
            board.answerCount = num;
        }
        result.update({});
        res.json(result);
    }
    catch(err){
        console.error(err);
        next(err);
    }
});

router.route(verifyToken, '/new')
.post( verifyToken, async(req,res,next)=>{
    const user = await User.findOne({where : {userID : res.locals.user}});
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

router.route(verifyToken,'/:id')
.get( async(req,res,next)=>{

    const boardID = req.params.id;
    try{
        const result = await Board.findOne({where : {id : boardID}});
        if(res.locals.user != result.boarder){          // 본인이 아니면 조회수를 늘려줌
            const temp = result.bbsViews+1;
            result.update({
                bbsViews : temp,
            }); 
        }   

        //이제 답변들 불러와야함
        const answers = await result.getAnswers();

        //각각의 댓글수들도 계산해야함
        const count_board = await result.getBoardComments().count();
        result.update({
            commentCount : count_board,
        })

        for( answer in answers){
            const count_answer = answer.getAnswerComments().count();
            answer.update({
                commentCount : count_answer,
            })
        }

        answers.update({});
        result.update({});
        return res.json(result + answers);
    }
    catch(err){
        console.error(err);
        next(err);
    }
})

.post( async(req,res,next)=>{
    
    const boardID = req.params.id;
    const { recommend } = req.body;
    try{
        const result = await Board.findOne({where: {id : boardID}});
        const temp = result.bbsReco + (+recommend);
        result.update({
            bbsReco : temp,
        });
        return res.json({state: "boardRecoChanged"});
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

module.exports = router;
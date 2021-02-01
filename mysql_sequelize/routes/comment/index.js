const express = require('express');
const Board = require('../../models/board');
const Comment = require('../../models/comment');
const { isLoggedIn} = require('../auth/middleware');

const router = express.Router();


router.route('/:id')
.get(isLoggedIn, async(req,res,next)=>{
    try{
        const temp = await Comment.findAll({
            include: {
                model: Board,
                where : {id : req.params.id},
            },
        });
        if(!temp) res.json({state : "notExisted"});
        return res.json(temp);
    }
    catch(err){
        console.error(err);
        next(err);
    }
})
.post(isLoggedIn, async(req,res,next)=>{

    const { commentContent } = req.body;
    try{
        await Comment.create({
            commentContent,
            boardID: req.params.id,
            commenter: req.user.userID,
            });
            return res.json({state : "commentSuccess"});
    }
    catch(err){
        console.error(err);
        next(err);
    }
});

router.route('/:id/:class')
.get(isLoggedIn, async(req,res,next)=>{

    const commentID = req.params.class;
    try{
        const result = await Comment.findOne({where : {id : commentID}});
        return res.json(result);
    }
    catch(err){
        console.error(err);
        next(err);
    }
})

.post(isLoggedIn, async(req,res,next)=>{
    
    const commentID = req.params.class;
    const { recommend } = req.body;
    try{
        const result = await Comment.findOne({where: {id : commentID}});
        const temp = result.commentReco + (+recommend);
        result.update({
            commentReco : temp,
        });
        return res.json({state: "commentRecoChanged"});
    }
    catch(err){
        console.error(err);
        next(err);
    } 

})

.patch(isLoggedIn, async(req,res,next)=>{
    const {commentContent} = req.body;
    try{
        await Comment.update({
            commentContent,
        },{
            where : {id : req.params.class},
        })
        return res.json({state: "commentChanged"});
    }
    catch(err){
        console.error(err);
        next(err);
    }
})

.delete(isLoggedIn, async(req,res,next)=>{
    try{
        await Comment.destroy({
            where: {id: req.params.class},
        })
        return res.json({state: "commentDeleted"});
    }
    catch(err){
        console.error(err);
        next(err);
    }

});

module.exports = router;
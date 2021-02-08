const express = require('express');
const { User } = require('../../models');
const Board = require('../../models/board');
const Hashtag =require('../../models/hashtag');
const { verifyToken } = require('../auth/middleware');

const router = express.Router();


router.route('/')
.get(async(req,res,next)=>{
    try{
        const result = await Board.findAll({ attributes: ['bbsTitle', 'bbsContent','boarder','created_at', 'hashTagContent']});
        res.json(result);
    }
    catch(err){
        console.error(err);
        next(err);
    }
});

router.route('/new')
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

router.route('/:id')
.get( async(req,res,next)=>{

    const boardID = req.params.id;
    try{
        const result = await Board.findOne({where : {id : boardID}});
        const temp = result.bbsViews+1;
        result.update({
            bbsViews : temp,
        }); 
        return res.json(result);
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
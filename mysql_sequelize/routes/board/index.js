const express = require('express');
const Board = require('../../models/board');
const { isLoggedIn} = require('../auth/middleware');

const router = express.Router();


router.route('/')
.get(isLoggedIn, async(req,res,next)=>{
    try{
        const result = await Board.findAll({ attributes: ['bbsTitle', 'boarder']});
        res.json(result);
    }
    catch(err){
        console.error(err);
        next(err);
    }
})
.post(isLoggedIn, async(req,res,next)=>{

    const { bbsTitle, bbsContent} = req.body;
    try{
        await Board.create({
            bbsTitle,
            bbsContent,
            boarder: req.user.userID,
            });
            return res.json({state : "boardSuccess"});
    }
    catch(err){
        console.error(err);
        next(err);
    }
});

router.route('/:id')
.get(isLoggedIn, async(req,res,next)=>{

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

.post(isLoggedIn, async(req,res,next)=>{
    
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

.patch(isLoggedIn, async(req,res,next)=>{
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

.delete(isLoggedIn, async(req,res,next)=>{
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
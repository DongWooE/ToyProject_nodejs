const express = require('express');
const User = require('../../models/user');
const Hashtag = require('../../models/hashtag');

const router = express.Router();


router.get('/hashtag', async( req, res, next)=>{

    const query = req.query.hashtag;
    if(!query){
        return res.json('queryNotExisted');
    }
    try{
        const hashtag = await Hashtag.findOne({where : {Content: query}});
        let posts =[];
        if(hashtag){
            posts = await hashtag.getBoards({include: [{ model : User, attributes: ['userID']}]});
        }
        return res.json(posts);

    }catch(error){
        console.error(error);
        return next(error);
    }

});


module.exports = router;
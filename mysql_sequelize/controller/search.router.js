const {User, Board} = require('../models');
const { rawAttributes } = require('../models/hashtag');
const Hashtag = require('../models/hashtag');
const { Op } = require('sequelize');

const getBoards = (async( req, res, next )=>{
    const { hashtag : query, limit, offset} = req.query;
    if(!query){
        return res.json('queryNotExisted');
    }
    try{
        const hashtag = await Hashtag.findOne({where : {title : query}});
        let posts =[];
        if(hashtag){
            posts = await hashtag.getBoards();
        }
        return res.json(posts);
    }catch(error){
        console.error(error);
        return next(error);
    }
});

const getHashTages = (async( req,res,next ) =>{
    try{
        const hashtags = await Hashtag.findAll({attributes : ['Content']});
        return res.json(hashtags);
    }catch(e){
        console.error(e);
        return next(e);
    }
})

const getSearch = (async(req,res,next)=>{
    const { limit, offset, searchString } = req.query;
    try{
        let posts =[];
        posts = await Board.findAll({ 
            where :
            { [Op.or] :[{bbsTitle : { [Op.like]: "%" + searchString + "%" }}, 
              {bbsContent : { [Op.like]: "%" + searchString + "%"}}]} })
        if(posts.length == 1) res.json({ state : empty });
        res.json(posts);
    }catch(e){
        console.error(e);
        return next(e);
    }
})

module.exports = {getBoards, getHashTages, getSearch};
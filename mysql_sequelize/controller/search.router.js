const {User} = require('../models');
const Hashtag = require('../models/hashtag');

const getHashTages = (async( req, res, next)=>{
    const { hashtag : query, limit, offset} = req.query;
    if(!query){
        return res.json('queryNotExisted');
    }
    try{
        const hashtag = await Hashtag.findOne({where : {Content: query}});
        let posts =[];
        if(hashtag){
            posts = await hashtag.findAll({include:});
        }
        return res.json(posts);

    }catch(error){
        console.error(error);
        return next(error);
    }
});

module.exports = {getHashTages};
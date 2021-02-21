const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/verify');
const {getHashTages} = require('../../controller/search.router')

router.get('/hashtag', getHashTages);

module.exports = router;
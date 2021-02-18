const express = require('express');
const router = express.Router();
const apiRouter = require('./api/v1');

router.get('/', (req,res) =>{
    res.send('ok');
});

router.use('/api', apiRouter);

module.exports = router;
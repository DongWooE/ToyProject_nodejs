const {Router} = require('express');
const router = Router();

const newRouter = require('./new');

router.use('/new', newRouter);

module.exports = router;
const {Router} = require('express');
const router = Router();

const v1Router = require('./orders');

router.use('/orders', v1Router);


module.exports = router;
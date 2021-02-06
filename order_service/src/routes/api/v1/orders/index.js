const {Router} = require('express');
const router = Router();


router.get('/', (req,res) =>{
    res.send('okok');
})

module.exports = router;
const express = require('express');
const router = express.Router();
const {verifyToken}  = require('../middleware/verify');
const {postLogin, postJoin, getLogout} = require('../../controller/auth.router')

router.post('/join', postJoin);            //회원가입
router.post('/login', postLogin);          //로그인
router.get('/logout', verifyToken, getLogout);      //로그아웃

module.exports = router;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
// 세션 방식, const passport = require('passport');

const postJoin = (async(req,res,next)=>{      //회원가입
    const {userID, userPassword , userName} = req.body;
    try{
        const exUser = await User.findOne({where : {userID}});     // userID인 객체를 가져와서 exUser에 대입
    if(exUser){     //회원가입인데 exUser가 존재하면 안되므로
        console.log("id is Duplicated");
        return res.json({state: "idDuplicated"});       //오류를 보내야하는데 이건 원중이와 협의해야함, redirect를 안드로이드에서 어떻게 받는지 봐야함
    }
    const hash = await bcrypt.hash(userPassword, 12);       //bcrypt 해쉬화한다
    await User.create(
        {
            userID,
            userName,
            userPassword : hash,

        });
        return res.status(201).json({state: "registerSuccess"});       
 }catch(error){
    console.error(error);
    return next(error);
 }
});

const postLogin = (async(req,res,next) =>{
    const { userID, userPassword} = req.body;
    const exUser = await User.findOne({where : {userID}});
    try{
    if(exUser){
        const result = await bcrypt.compare(userPassword, exUser.userPassword);
        if(result){
            const token = jwt.sign({
                id: exUser.userID,
                nick: exUser.userName,
            }, process.env.JWT_SECRET,{
                expiresIn : '1d',
            });
            res.cookie('user', token);
            return res.json({
                state : "loginSuccess",
                nick : exUser.userName,
            });
        }
        else{
            return res.status(401).json({state : "passwordUncorrect"});
        }
    }
    return res.status(401).json({state : "wrongAccount"});
    }catch(error){
        res.json(error);
    }
})

const getLogout = ((req,res)=>{
    res.clearCookie('user');
    return res.json({state: "logoutSuccess"});

    //passport를 사용한 코드라면
    // req.logout();       //서버에서 세션 쿠키가 사라진다
    // req.session.destroy();      //세션도 삭제
    // return res.json({state: "logoutSuccess"});
});

module.exports = { postLogin, postJoin, getLogout};


// 토큰 테스트 코드
// router.get('/test', verifyToken, (req,res) =>{
//     res.json(req.decoded);
// });

// 세션방식을 사용했던 로그인
// router.post('/login', isNotLoggedIn, (req,res,next)=>{      //이 자체도 미들웨어이고 미들웨어 안에 있으므로 미들웨어 확장패턴
//     passport.authenticate('local', (authError, user, info) =>{  //여기서 passport.authenticate안에 'local'이 실행되면 passport는 localStrategy를 찾는다
//         if(authError){      //done의 첫번째 인자가 존재하면 서버에러이므로
//             console.error(authError);
//             res.status(500);
//             return next(authError);
//         }
//         if(!user){      //로그인에 실패한 경우
//             return res.json({state: `${info.message}`});
//         }
//         return req.login(user, (loginError) =>{     //로그인에 성공한 경우
//             if(loginError){
//                 res.json({state: `${info.message}`});
//                 console.error(loginError);
//                 return next(loginError);
//             }   //여기에서 세션쿠키를 브라우저에 보내준다
//             return res.json({state : "loginSuccess", nickName : `${user.userName}` });
//         });
//     })(req,res,next);

// });

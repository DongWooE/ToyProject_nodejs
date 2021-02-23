//middlewares.js 는 라우터를 통해서 로그인하지않은 사용자가 로그아웃 라우터에 접근하지못하고 
//같은 경우로 로그인한 사용자가 회원가입과 로그인 라우터에 접근하지못하도록 한다

const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) =>{
    try{
        req.decoded = jwt.verify(req.cookies.user, process.env.JWT_SECRET);
        res.locals.user = req.decoded.id;
        return next();   
    }
    catch(error){
        if(error.name == "TokenExpiredError"){
            return res.status(205).json({
                state: "tokenExpired"
            });
        }
        return res.status(206).json({
            state: "invalidToken"
        });
    }
}

// exports.isLoggedIn = (req, res, next)=>{
//     if(req.isAuthenticated()){
//         next();
//     }
//     else{
//         return res.json({state: "needLogin"});
//     }    
// }

// exports.isNotLoggedIn = (req, res, next) =>{
//     if(!req.isAuthenticated()){
//         next();
//     }else{
//         return res.json({state: "needLogout"});
//     }
// }

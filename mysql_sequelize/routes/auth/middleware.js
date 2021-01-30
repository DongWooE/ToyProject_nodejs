//middlewares.js 는 라우터를 통해서 로그인하지않은 사용자가 로그아웃 라우터에 접근하지못하고 
//같은 경우로 로그인한 사용자가 회원가입과 로그인 라우터에 접근하지못하도록 한다


exports.isLoggedIn = (req, res, next)=>{
    if( req.isAuthenticated()){
    next();
    }
    else{
        return res.json({state: "needLogin"});
    }    
}

exports.isNotLoggedIn = (req, res, next) =>{
    if(!req.isAuthenticated()){
        next();
    }else{
        return res.json({state: "needLogout"});
    }
}
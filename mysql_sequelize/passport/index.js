// const passport = require('passport');
// const local = require('./localStrategy');
// const User = require('../models/user');

// module.exports = ()=>{
//     passport.serializeUser((user,done)=>{       //로그인시 실행되며 req.session 객체에 어떤 데이터를 저장할지 정하는 메서드
//         done(null, user.userID);                    //done함수 인자, 첫번쨰 : 서버에러, 두번째 : 저장하고 싶은 데이터, 세번째 : 로그인 실패시 유저 객체
//     });

//     passport.deserializeUser((userID, done)=>{      //매 요청 시에 실행되며, passport.session에 의해서 호출됨, serializeUser의 두번쨰 인자가 여기에 전달됨
//         User.findOne({where: {userID}})             //쉽게 말해서 세션에 저장된 아이디를 통해 사용자 정보 객체를 불러오는 것
//         .then(user=>done(null, user))       //데이터 베이스에서 id를 조회한후 req.user에 저장후 
//         .catch(err=>done(err));
//     });

//     local();        //local을 등록해놓은것임
// };
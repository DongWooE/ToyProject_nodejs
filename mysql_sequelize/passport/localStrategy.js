// const passport = require('passport');
// const LocalStrategy = require('passport-local').Strategy;
// const bcrypt = require('bcrypt');

// const User = require('../models/user');

// module.exports = () =>{
//     passport.use(new LocalStrategy({        //여기서 userNameFIled와 passwordField는 passport-local에서 넘겨받아야하는 키워드 인자인듯
//         usernameField : 'userID',           //req.body.userID
//         passwordField : 'userPassword',
//     }, async (userID, userPassword, done) =>{
//         try {
//             const exUser = await User.findOne({where: {userID}});
//             if(exUser){
//                 const result = await bcrypt.compare(userPassword, exUser.userPassword);     //비밀번호를 비교한다
//                 if(result){
//                     done(null, exUser);    
//                 }
//                 else{
//                     done(null, false, {message: 'passwordUncorrect'});
//                 }
//             }
//             else{
//                 done(null, false, {message : 'wrongAccount'});
//             }
//         }
//         catch(error){
//             console.error(error);
//             done(error);
//         }
//     }));

// };
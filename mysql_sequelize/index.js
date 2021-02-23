const express = require('express');
const app = express();
const morgan = require('morgan');
const dotenv = require('dotenv');
const { sequelize} = require('./models/index.js');
const User = require('./models/user.js');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const router = require('./routes');
//const passport = require('passport');
//const session = require('express-session');
//const passportConfig = require('./passport');       //index.js와 passport/index.js와 연결해준다

//passportConfig();
dotenv.config();

app.set('port', process.env.PORT || 3001);
app.use(morgan('dev'));
app.use(express.json());
app.use(cors({origin:true, credentials : true}));
app.use(express.urlencoded({extended: false}));
app.use(cookieParser(process.env.COOKIE_SECRET));
//DB 연동부분
sequelize.sync({force : false})
.then(()=>{
    console.log("DB 연결 성공");
})
.catch((err)=>{
    console.log('DB 연결 실패');
    console.error(err);
});


// app.use(session({       //세션 관리용 미들웨어
//     resave: false,                              //요청이 올때 세션에 수정 사항이 생기지않더라도 세션을 다시 저장할지 설정하는 것
//     saveUninitialized: false,                   //세션에 저장할 내역이 없더라도 세션을 다시 생성할지 설정하는 것
//     secret: process.env.COOKIE_SECRET,          //connet.sid의 세션쿠키
//     cookie:{                                    //세션 쿠키에 대한 옵션
//         httpOnly: true,                         //클라이언트에서 쿠키를 확인하지 못함
//         secure: false,                          //http가 아닌 환경에서도 사용가능
//         domain: '.ngrok.io',
//     },
// }));
//     //아래 2개는 express-session보다 아래에 있어야한다 
// app.use(passport.initialize());     //request에 passport 설정을 심고
// app.use(passport.session());        //request.session 객체에 passport 정보를 저장

app.use('/', router);

app.use((req,res,next) => {
    const error = new Error(`${req.method} ${req.url} router not existed`);
    error.status = 404;
    next(error);
});

app.listen(app.get('port'), ()=>{
    console.log(app.get('port'), '번 포트에서 대기 중');
});
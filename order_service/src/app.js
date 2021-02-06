const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const cors = require('cors');
const { sequelize } = require('./models');
const router = require('./routes/index');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.set('port', process.env.PORT || 3000);

//db connect
sequelize.sync({ force: false }) // 테이블을 잘못 만든 경우에는 true로 설정.(테이블 재생성)
  .then(() => {
    console.log('db connected!');
  })
  .catch((err) => {
    console.error(err);
  })


// Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:false}));

//Routing
app.use(router);

app.use((req, res, next) => {
  const error = new Error(`${req.method} ${req.url} 라우터가 없다.`);
  error.status = 404;
  next(error);
});

//error handler
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err
  });
});


//Start server
app.listen(app.get('port'), () => {
  console.log(
    `!!!App is running at http://localhost:${app.get('port')} in ${app.get(
      'env')} mode!!!`);
});
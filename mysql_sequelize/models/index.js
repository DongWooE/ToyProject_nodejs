const Sequelize = require('sequelize');
const User = require('./user');
const Board = require('./board');
const Answer = require('./answer');
const BoardComment = require('./boardComment');
const AnswerComment = require('./answerComment');
const BoardLike = require('./boardLike');
const AnswerLike = require('./answerLike');

const Hashtag = require('./hashtag');

const env = process.env.NODE_ENV || "development";
const config = require('../config/index')[env];
const db = {};

//시퀄라이즈 <-> DB 연동 부분
const sequelize = new Sequelize(config.database, config.username, config.password, config);
db.sequelize = sequelize;

db.User = User;

db.Board = Board;
db.BoardComment = BoardComment;
db.BoardLike = BoardLike;

db.Answer = Answer;
db.AnswerComment = AnswerComment;
db.AnswerLike = AnswerLike;

db.Hashtag = Hashtag;

User.init(sequelize);
Board.init(sequelize);
Hashtag.init(sequelize);

Answer.init(sequelize);
BoardComment.init(sequelize);
AnswerComment.init(sequelize);
BoardLike.init(sequelize);
AnswerLike.init(sequelize);


User.associate(db);
Board.associate(db);
Hashtag.associate(db);

Answer.associate(db);
BoardComment.associate(db);
AnswerComment.associate(db);
BoardLike.associate(db);
AnswerLike.associate(db);

Answer.hookFunction(db);
AnswerComment.hookFunction(db);

module.exports = db;

const Sequelize = require('sequelize');
const User = require('./user');
const Board = require('./board');
const Comment = require('./comment');
const Hashtag = require('./hashtag');
const env = process.env.NODE_ENV || "development";
const config = require('../config/index')[env];
const db = {};

//시퀄라이즈 <-> DB 연동 부분
const sequelize = new Sequelize(config.database, config.username, config.password, config);
db.sequelize = sequelize;

db.User = User;
db.Board = Board;
db.Comment = Comment;
db.Hashtag = Hashtag;

User.init(sequelize);
Board.init(sequelize);
Comment.init(sequelize);
Hashtag.init(sequelize);

User.associate(db);
Board.associate(db);
Comment.associate(db);
Hashtag.associate(db);

module.exports = db;

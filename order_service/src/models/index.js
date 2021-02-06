'use strict';

const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development'; //배포할 때 production으로 설정
const config = require('../config/index')[env];

const Order = require('./order');
const OrderItem = require('./orderItem');

const db = {};

const sequelize = new Sequelize(
  config.database, 
  config.username, 
  config.password, 
  config
);

db.sequelize = sequelize;

db.Order = Order;
db.OrderItem = OrderItem;

Order.init(sequelize);
OrderItem.init(sequelize);

Order.associate(db);
OrderItem.associate(db);

module.exports = db;
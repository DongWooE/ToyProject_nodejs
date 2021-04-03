const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development'; 
const config = require('../config/index')[env];

const SelectiveClinic = require('./selectiveClinic');

const db = {};

const sequelize = new Sequelize(
  config.database, 
  config.username, 
  config.password, 
  config
);

db.sequelize = sequelize;

db.SelectiveClinic = SelectiveClinic;

SelectiveClinic.init(sequelize);

module.exports = db;
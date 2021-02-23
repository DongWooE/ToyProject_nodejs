const Sequelize = require('sequelize');

module.exports = class Board extends Sequelize.Model{
    static init(sequelize){
        return super.init({
            bbsTitle: {
                type: Sequelize.STRING(100),
                allowNull: false,
            },
            bbsContent: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
            bbsViews:{
                type: Sequelize.INTEGER.UNSIGNED,
                allowNull: false,
                defaultValue : 0,
            },
            bbsReco:{
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue : 0,
            },
            answerCount: {
                type : Sequelize.INTEGER.UNSIGNED,
                allowNull : false,
                defaultValue : 0,
            },
            commentCount: {
                type : Sequelize.INTEGER.UNSIGNED,
                allowNull : false,
                defaultValue : 0,
            },
            hashTagContent:{
                type: Sequelize.STRING(40),
                allowNull: true,
            },
        },{
            sequelize,
            timestamps: true,
            underscored: false,
            paranoid: false,     
            modelName: 'Board',
            tableName: 'boards',
            charset: 'utf8',
            collate: 'utf8_general_ci',
       });    
    
    }
    
    static associate(db) {
        db.Board.belongsTo(db.User, {foreignKey: 'boarder', targetKey: 'userID'});
        db.Board.belongsToMany(db.Hashtag, {through: 'BoardHashtag'});

        db.Board.hasMany(db.Answer, {foreignKey: 'boardID', sourceKey : 'id'});
        db.Board.hasMany(db.BoardComment, {foreignKey: 'boardID', sourceKey : 'id'});
        db.Board.hasMany(db.BoardLike, {foreignKey: 'boardID', sourceKey : 'id'});
      }
}
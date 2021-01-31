const Sequelize = require('sequelize');

module.exports = class Comment extends Sequelize.Model{
    static init(sequelize){
        return super.init({
            commentContent: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
            commentReco:{
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue : 0,
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW,
            },
        },{
            sequelize,
            timestamps: false,
            underscored: false,
            paranoid: false,     
            modelName: 'Comment',
            tableName: 'comments',
            charset: 'utf8',
            collate: 'utf8_general_ci',
       });    
    
    }

    
    static associate(db) {
        db.Comment.belongsTo(db.User, {foreignKey: 'commenter', targetKey: 'userID'})
        db.Comment.belongsTo(db.Board, {foreignKey: 'boardID', targetKey: 'id'});
      }
}
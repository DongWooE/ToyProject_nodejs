const Sequelize = require('sequelize');

module.exports = class BoardComment extends Sequelize.Model{
    static init(sequelize){
        return super.init({
            commentContent: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
        },{
            sequelize,
            timestamps: true,
            underscored: false,
            paranoid: false,     
            modelName: 'BoardComment',
            tableName: 'boardcomments',
            charset: 'utf8',
            collate: 'utf8_general_ci',
       });    
    
    }

    
    static associate(db) {
        db.BoardComment.belongsTo(db.User, {foreignKey: 'boardCommenter', targetKey: 'userID'})
        db.BoardComment.belongsTo(db.Board, {foreignKey: 'boardID', targetKey: 'id'});
      }
}
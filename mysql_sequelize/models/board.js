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
            modelName: 'Board',
            tableName: 'boards',
            charset: 'utf8',
            collate: 'utf8_general_ci',
       });    
    
    }

    
    static associate(db) {
        db.Board.belongsTo(db.User, {foreignKey: 'boarder', targetKey: 'userID'});
      }
}
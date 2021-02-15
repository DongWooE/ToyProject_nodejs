const Sequelize = require('sequelize');

module.exports = class BoardLike extends Sequelize.Model{
    static init(sequelize){
        return super.init({
            isAdd: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue : false,
            },
        },{
            sequelize,
            timestamps: true,
            underscored: false,
            paranoid: false,     
            modelName: 'BoardLike',
            tableName: 'boardlikes',
            charset: 'utf8',
            collate: 'utf8_general_ci',
       });    
    
    }

    
    static associate(db) {
        db.BoardLike.belongsTo(db.User, {foreignKey: 'userID', targetKey: 'userID'})
        db.BoardLike.belongsTo(db.Board, {foreignKey: 'boardID', targetKey: 'id'});
      }
}
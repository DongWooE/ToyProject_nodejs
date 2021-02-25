const Sequelize = require('sequelize');

module.exports = class AnswerLike extends Sequelize.Model{
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
            modelName: 'AnswerLike',
            tableName: 'answerlikes',
            charset: 'utf8',
            collate: 'utf8_general_ci',
       });    
    
    }

    static associate(db) {
        db.AnswerLike.belongsTo(db.User, {foreignKey: 'userID', targetKey: 'userID'})
        db.AnswerLike.belongsTo(db.Answer, {foreignKey: 'answerID', targetKey: 'id'});
      }
}
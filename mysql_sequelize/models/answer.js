const Sequelize = require('sequelize');

module.exports = class Answer extends Sequelize.Model{
    static init(sequelize){
        return super.init({
            answerContent: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
            answerReco:{
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue : 0,
            },
            commentCount: {
                type : Sequelize.INTEGER.UNSIGNED,
                allowNull : false,
                defaultValue : 0,
            },
        },{
            sequelize,
            timestamps: true,
            underscored: false,
            paranoid: false,     
            modelName: 'Answer',
            tableName: 'answers',
            charset: 'utf8',
            collate: 'utf8_general_ci',
       });    
    
    }

    static hookFunction(db){
        db.Answer.addHook('afterCreate', async(answer, options) =>{
            const board = await db.Board.findOne({ where : { id : answer.boardID}});
            let answerCount = board.answerCount +1;
            await board.update({ answerCount });
        });
        db.Answer.addHook('beforeDestroy', async(answer, options) =>{
            const board = await db.Board.findOne({ where : { id : answer.boardID}});
            let answerCount = board.answerCount -1;
            await board.update({ answerCount });
        })
    }
    
    static associate(db) {
        db.Answer.belongsTo(db.User, {foreignKey: 'answerer', targetKey: 'userID'});
        db.Answer.belongsTo(db.Board, {foreignKey: 'boardID', targetKey: 'id'});

        db.Answer.hasMany(db.AnswerComment, {foreignKey : 'answerID', sourceKey: 'id'});
        db.Answer.hasMany(db.AnswerLike, {foreignKey : 'answerID', sourceKey: 'id'});
      }
}
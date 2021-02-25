const Sequelize = require('sequelize');

module.exports = class AnswerComment extends Sequelize.Model{
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
            modelName: 'AnswerComment',
            tableName: 'answercomments',
            charset: 'utf8',
            collate: 'utf8_general_ci',
       });    
    
    }

    static hookFunction(db){
        db.AnswerComment.addHook('afterCreate', async(comment, options) =>{
            const answer = await db.Answer.findByPk(comment.answerID);
            let commentCount = answer.answerCount +1;
            await answer.update({ commentCount });
        });
        db.AnswerComment.addHook('beforeDestroy', async(comment, options) =>{
            const answer = await db.Answer.findByPk(comment.answerID);
            let commentCount = answer.answerCount -1;
            await answer.update({ commentCount });
        })
    }
    
    static associate(db) {
        db.AnswerComment.belongsTo(db.User, {foreignKey: 'answerCommenter', targetKey: 'userID'})
        db.AnswerComment.belongsTo(db.Answer, {foreignKey: 'answerID', targetKey: 'id'});
      }
}
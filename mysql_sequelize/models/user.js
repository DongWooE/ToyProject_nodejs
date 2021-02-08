const Sequelize = require('sequelize');

module.exports = class User extends Sequelize.Model{
    static init(sequelize){
        return super.init({
            userID : {
                type : Sequelize.STRING(40),
                allowNull : false,
                unique: true,
                primaryKey : true,
            },
            userPassword : {
                type : Sequelize.STRING(100),
                allowNull : false,
            },
            userName : {
                type : Sequelize.STRING(20),
                allowNull : false,
            },
            userScore : {
                type : Sequelize.INTEGER.UNSIGNED,
                allowNull : true,
                defaultValue : 0,
            },
        },
        {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName : 'User',
            tableName : 'users',
            paranoid : true,
            charset : "utf8",
            collate: 'utf8_general_ci'
        }
        );

    }

    
    
    static associate(db) {
        db.User.hasMany(db.Board, { foreignKey: 'boarder', sourceKey: 'userID' });
        db.User.hasMany(db.BoardComment, { foreignKey: 'boardCommenter', sourceKey: 'userID' });
        db.User.hasMany(db.BoardLike, { foreignKey: 'userID', sourceKey: 'userID' });

        db.User.hasMany(db.Answer, { foreignKey: 'answerer', sourceKey: 'userID' });
        db.User.hasMany(db.AnswerComment, { foreignKey: 'answerCommenter', sourceKey: 'userID' });
        db.User.hasMany(db.AnswerLike, { foreignKey: 'userID', sourceKey: 'userID' });

      }

}
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
            created_at: {
                type : Sequelize.DATE,
                allowNull : false,
                defaultValue : Sequelize.NOW,
            },
        },
        {
            sequelize,
            timestamps: false,
            underscored: false,
            modelName : 'User',
            tableName : 'users',
            paranoid : false,
            charset : "utf8",
            collate: 'utf8_general_ci'
        }
        );

    }

    
    
    static associate(db) {
        db.User.hasMany(db.Board, { foreignKey: 'boarder', sourceKey: 'userID' });
      }

}
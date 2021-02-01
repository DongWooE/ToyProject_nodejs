const Sequelize = require('sequelize');

module.exports = class Hashtag extends Sequelize.Model{
    static init(sequelize){
        return super.init({
            Content: {
                type: Sequelize.STRING(40),
                allowNull: false,
            },
        },{
            sequelize,
            timestamps: true,
            underscored: false,
            paranoid: false,     
            modelName: 'Hashtag',
            tableName: 'hashtags',
            charset: 'utf8',
            collate: 'utf8_general_ci',
       });    
    
    }

    
    static associate(db) {
        db.Hashtag.belongsToMany(db.Board, {through: 'BoardHashtag'});
      }
}
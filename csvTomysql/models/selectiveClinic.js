const Sequelize = require('sequelize');

module.exports = class SelectiveClinic extends Sequelize.Model{

    static init(sequelize){
        return super.init({
            name : {
                type : Sequelize.STRING(40),
                allowNull : false,
                primaryKey: true,
            },
            locate: {
                type : Sequelize.STRING(40),
                allowNull : false,
            },
            address : {
                type : Sequelize.TEXT,       
                allowNull : false,      
            },
            phone : {
                type : Sequelize.STRING(20),
                allowNull : false,
            },
            x : {                       
                type : Sequelize.DOUBLE.UNSIGNED,
                allowNull : false,
            },
            y : {                       
                type : Sequelize.DOUBLE.UNSIGNED,
                allowNull : false,
            },
        },         
        {
            sequelize,
            timestamps : false,
            underscored : false,
            modelName : 'SelectiveClinic',
            tableName : 'selectiveclinics',
            paranoid : false,
            charset : 'utf8',
            collate : 'utf8_general_ci',
        });
    }
}
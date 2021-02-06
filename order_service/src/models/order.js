const Sequelize = require('sequelize');

module.exports = class OrderItem extends Sequelize.Model{

    static init(sequelize){
        return super.init({
            userID : {
                type : Sequelize.STRING(40),        //실제 회원정보의 길이를 보고 다시 결정할것
                allowNull : false,
            },
            entirePrice : {
                type : Sequelize.INTEGER.UNSIGNED,
                allowNull : false,
                defaultValue : 0,
            }
            },
            {
            sequelize,
            timestamps : true,
            underscored : false,
            modelName : 'Order',
            tableName : 'orders',
            paranoid : false,
            charset : 'utf8',
            collate : 'utf8_general_ci',
        });
    }

    static associate(db){
        db.Order.hasMany(db.OrderItem, {foreignKey : 'orderID', sourcetKey : 'id'});

    }


}
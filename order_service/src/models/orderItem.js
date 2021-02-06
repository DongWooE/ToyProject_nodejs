const Sequelize = require('sequelize');

module.exports = class OrderItem extends Sequelize.Model{

    static init(sequelize){
        return super.init({
            productName : {
                type : Sequelize.STRING(40),
                allowNull : false,
            },
            productImage : {
                type : Sequelize.STRING(200),
                allowNull : true,
            },
            state : {
                type : Sequelize.BOOLEAN,       //물건의 상태를 주문완료, 주문취소대기중으로 나눈다
                allowNull : false,      
                defaultValue : true,            //기본값으로 true를 준다
            },
            count : {
                type : Sequelize.INTEGER.UNSIGNED,
                allowNull : false,
                defaultValue : 1,
            },
            price : {                       //price는 개당 가격을 뜻함
                type : Sequelize.INTEGER.UNSIGNED,
                allowNull : false,
                defaultValue : 0
            },
        },          //기본적으로 associate를 줘서 orderID와 _id가 추가로 생성됨
        {
            sequelize,
            timestamps : true,
            underscored : false,
            modelName : 'OrderItem',
            tableName : 'orderitems',
            paranoid : false,
            charset : 'utf8',
            collate : 'utf8_general_ci',
        });
    }

    static associate(db){
        db.OrderItem.belongsTo(db.Order, {foreignKey : 'orderID', targetKey : 'id'});

    }


}
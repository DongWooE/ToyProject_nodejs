const { Router } = require('express');
const router = Router();
const Order = require("../../../../../models/order");
const OrderItem = require("../../../../../models/orderItem");

router.route('/')
.get(async(req, res, next) =>{     //주문이 들어온다면 order 테이블을 하나 만들고 orderID를 넘겨준다 
    try{
        const order = await Order.create({      //나중에 회원 서비스만들면 token 방식으로 아이디를 가져온다
            userID : "test2",
        });
        const result = order.id;
        res.json({ key : result});

    }
    catch(error){
        console.error(error);
        next(error);
    }

})

router.route('/:id')
.post(async(req, res, next) =>{
    try{
        const order = await Order.findOne({ where : { id : `${req.params.id}`}});
        const { productName, productImage, count, price } = req.body;
        const orderItem = await OrderItem.create({
            productName,
            productImage,
            count,
            price,
        });
        order.addOrderItem(orderItem);
        res.json({ state : "success"});

    }catch(error){
        console.error(error);
        next(error);
    }

});

module.exports = router;
const { OrderItem, Order } = require('../models');

const getOrderItem = async(req,res,next) =>{
    try{
        const orderItems = await OrderItem.findOne({ where : {id : `${req.params.id}`}});
        if(!orderItems) res.json({message : "item not found"});
        res.json(orderItems);
    }catch(e){
        console.error(e);
        next(e);
    }
}

const postOrderItem = async(req,res,next) =>{
    try{
        const order = await Order.findOne({ where : { id : `${req.params.id}`}});
        if(!order) res.json({ message : "order not found"});
        const {productName, productImage, count, price} = req.body;
        const orderItem = await OrderItem.create({
            productName,
            productImage,
            count,
            price,
        });
        order.addOrderItems(orderItem);
        res.json({ state: "success", item : orderItem});
    }catch(e){
        console.error(e);
        next(e);
    }
}

const cancelOrderItem = async(req,res,next) =>{     //상품을 결제 후에 취소할때 호출되는 함수 
    try{
        const orderItems = await OrderItem.findOne({ where : { id : `${req.params.id}`}});
        if(!orderItems) res.json({message : "order not found"});
        orderItems.update({
            state : false,
        })
        console.log(orderItems);
        res.json({ message : "order canceled"});
    }catch(e){
        console.error(e);
        next(e);
    }
}
module.exports = { getOrderItem,postOrderItem,cancelOrderItem};
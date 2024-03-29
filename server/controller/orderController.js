const Order = require("../models/OrderModel.js")
const Product = require("../models/productModels.js")
const ErrorHandler = require("../utils/errorhandler.js")
const catchAsyncErrors = require("../middleware/catchAsyncErrors")


exports.newOrder = catchAsyncErrors(async (req, res, next) => {
    const {
        shippingInfo, 
        orderItems, 
        paymentInfo, 
        itemsPrice, 
        taxPrice, 
        shippingPrice, 
        totalPrice
    } = req.body

    const order = await Order.create({
        shippingInfo, 
        orderItems, 
        paymentInfo, 
        itemsPrice, 
        taxPrice, 
        shippingPrice, 
        totalPrice,
        paidAt : Date.now(),
        user : req.user._id,
    })

    res.status(201).json({
        success : true,
        order,
    })
})


exports.getSingleOrder = catchAsyncErrors(async(req, res, next) => {
    const order = await Order.findById(req.params.id).populate("user", "name email")

    if(!order){
        return next(new ErrorHandler("order not found with this id", 404))

    }

    res.status(200).json({
        success : true,
        order
    })

})




exports.myOrders = catchAsyncErrors(async(req, res, next) => {
    const orders = await Order.find({user : req.user._id})


    res.status(200).json({
        success : true,
        orders,
    })

})


//get all orders (admin)
exports.getAllOrders = catchAsyncErrors(async(req, res, next) => {
    const orders = await Order.find()

    let totalAmount = 0;

    orders.forEach((order) => {
        totalAmount += order.totalPrice
    })

    res.status(200).json({
        success : true,
        totalAmount,
        orders,
    })

})


//update order status (Admin)
exports.updateOrder = catchAsyncErrors(async(req, res, next) => {
    const order = await Order.findById(req.params.id);

    if(order.orderStatus === "Delivered"){
        return next(new ErrorHandler("You have already devivered this order", 400))
    }

    order.orderItems.forEach(async (order) => {
        await updateStock(order.product, order.quantity);
    })

    order.orderStatus = req.body.status;

    if(req.body.status === "Delivered"){
        order.deliveredAt = Date.now()
    }

    await order.save({validateBeforeSave : false});

    res.status(200).json({
        success : true,
        order,
    })

})

async function updateStock (id, quantity){
    const product = await Product.findById(id);

    product.stock -= quantity;

    await product.save({validateBeforeSave : false});
}


//delete order (admin)
exports.deleteOrder = catchAsyncErrors(async(req, res, next) => {
    const order = await Order.findById(req.params.id)

    
    if(!order){
        return next(new ErrorHandler("order not found with this id", 404))

    }


    await order.remove()

    res.status(200).json({
        success : true,
        message : "Order deleted"
    })

})
const Order = require('../models/order');

module.exports = {};

// admin and user can access this item
module.exports.createItem = async (newOrder) => {
  // console.log('here created order DAOS')
  return await Order.create(newOrder);
}

// find by order ID,return the user ID
module.exports.findById = async (orderId) => {
  const order = await Order.findOne({ _id:orderId }).lean();
  return order.userId;
}

//
module.exports.findMatchUserAndOrder = async (userObjectId, orderId) => {
  const order = await Order.findOne({ _id:orderId, userId:userObjectId }).lean();
  return order;
}

module.exports.findByIdAdmin = async (orderId) => {
  const order = await Order.findOne({ _id:orderId }).lean();
  return order;
}

// only admin can get all orders
module.exports.getOrdersAdmin = () => {
  return Order.find().lean();
}

/*
* @params [ userObjectId ], input the user ObjectId to get all their orders
*/
module.exports.getOrdersUser = async (userObjectId) => {
  return await Order.find({userId : userObjectId});
}

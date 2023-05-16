const mongoose = require('mongoose');

const quantitySchema = new mongoose.Schema({
  item: { type: mongoose.Schema.Types.ObjectId, ref: 'items', required: true },
  quantity: { type: Number, required: true}
}, { strict: false })

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
  items:  { type: [quantitySchema] , required: true },
  total:  { type: Number, required: true }
});

/*
const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
  items: {[ type:  mongoose.Schema.Types.ObjectId, ref: 'items', required: true ]}, required: true ,
  total: { type: Number, required: true }
});
*/

module.exports = mongoose.model("orders_old", orderSchema);
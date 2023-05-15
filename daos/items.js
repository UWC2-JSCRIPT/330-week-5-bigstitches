const Item = require('../models/item');

module.exports = {};

module.exports.createItem = async (newItem) => {
  return await Item.create(newItem);
}

module.exports.findById = async (itemId) => {
  const item = await Item.findOne({ _id:itemId }).lean();
  return item;
}

module.exports.findByTitlePrice = async (itemTitle, itemPrice) => {
  const item = await Item.findOne({ title:itemTitle, price:itemPrice }).lean();
  return item;
}

module.exports.getItems = () => {
  return Item.find().lean();
}

module.exports.updateItem = async (itemId, updates) => {
  // console.log('Updates', updates);
  // console.log('ID', itemId);
  // const updatedItem = await Item.findByIdAndUpdate( itemId, updates, {returnOriginal: false}); //works
  // const updatedItem = await Item.findOneAndUpdate( {_id:itemId}, updates, {returnOriginal: false}); // works
  const updatedItem = await Item.findOneAndUpdate( {_id : itemId}, updates, {new: true}); //works
  return updatedItem;
}
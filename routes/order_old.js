const { Router } = require("express");
const orderDAO = require('../daos/order');
const itemExists = require('../middleware/itemExists')
const isAuthorized = require('../middleware/isAuthorized');
const isLoggedInOrders = require('../middleware/isLoggedInItems');
const router = Router();

// Create `POST /items`
router.post("/", isLoggedInOrders, async (req, res, next) => {
  // Middleware Handle the Inputs
  const itemObjectArray = req.body;
  // if the array is empty
  if (!itemObjectArray || itemObjectArray === []) {
    res.status(401).send('Empty Orders Cannot be Created');
  } else {
    // pass this to middleware function itemExists
    req.itemObjectArray = itemObjectArray;
    // console.log(itemObjectArray);
    next();
  }
}, itemExists, async (req, res, next) => {
  newOrder = {
    'userId': req.userId._id,
    'items':  req.itemObjectArrayApproved,
    'total':  req.total
  }
  // console.log('newOrder ',newOrder);
  /*
    newOrder  {
      userId: '64639ccf80f1e43cb98a153d',
      items: [
        { item: '64639ccf80f1e43cb98a1535', quantity: 2 },
        { item: '64639ccf80f1e43cb98a1534', quantity: 1 }
      ],
      total: 3
    }
  */

  try {
    // console.log('item order created');
    const itemCreated = await orderDAO.createItem(newOrder); 
    res.status(200).json(itemCreated); 
  } catch(e) {
    // console.log('In error', e.message);
    res.status(400).send(e.message);
  }
});

// (PUT) Get a single item & update it: `PUT /items/:id` - for ADMIN ONLY
router.put("/:id", isLoggedInOrders, isAuthorized, async (req, res, next) => {
  res.status(200).json('here'); 
  /*
  req.price = req.body.price;
  req.title = req.body.title;
  if (!req.price && !req.title) {
    let error = 'No updates, must have price or title or both.';
    next(error);
  } else  next()
}, async (req, res, next) => {
  try {
    if (!req.price) {
      const udpatedItem = await orderDAO.updateItem(req.itemId, {'title': req.title});
      res.status(200).json(udpatedItem); 
    } else if (!req.title) {
      const udpatedItem = await orderDAO.updateItem(req.itemId, {'title': title});
      res.status(200).json(udpatedItem); 
    } else {
      const updates = { 
        'title': req.title,
        'price': req.price,
      }
      const udpatedItem = await orderDAO.updateItem(req.itemId, updates);
      res.status(200).json(udpatedItem); 
    }
  } catch (e) {
    next(e);
  }
  */
});

//  Get all of my notes: `GET /items` for all 'USERS'
router.get("/:id", isLoggedInOrders, async (req, res, next) => {
  res.status(200).json('here'); 
  /*
  try {
    const items = await orderDAO.findById(req.params.id);
    res.status(200).json(items);
  } catch (e) {
    res.status(500).send(e.message);
  }
  */
});

//  Get all of my notes: `GET /items` for all 'USERS'
router.get("/", isLoggedInOrders, async (req, res, next) => {
  res.status(200).json('here'); 
  /*
  try {
    const items = await orderDAO.getItems();
    res.status(200).json(items);
  } catch (e) {
    res.status(500).send(e.message);
  }
  */
});

module.exports = router;

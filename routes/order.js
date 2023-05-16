const { Router } = require("express");
const orderDAO = require('../daos/order');
const itemDAO = require('../daos/items');
const itemExists = require('../middleware/itemExists_new')
const isAuthorizedOrders = require('../middleware/isAuthorizedOrders');
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
    // pass this to middleware function itemExists_new
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
  try {
    // console.log('item order created', newOrder);
    const itemCreated = await orderDAO.createItem(newOrder); 
    res.status(200).json(itemCreated); 
    /*
      item order created {
      userId: '6463d4a2b24d345ef8ed1019',
      items: [ new ObjectId("6463d4a2b24d345ef8ed1011") ],
      total: 1
      }
    */
  } catch(e) {
    console.log('In error', e.message);
    /*
    FIXED, adjusted orders model put brackets around everything after items instead of just the object
      console.log
      In error orders_new validation failed: items.0: Cast to [ObjectId] failed for value "[\n' +
      "  { item: '6463d129d5c67a1ee45d463d' },\n" +
      "  { item: '6463d129d5c67a1ee45d463e' }\n" +
      ']" (type string) at path "items.0" because of "CastError"
    */
    res.status(400).send(e);
  }
});

//  Get all of my notes: `GET /items` for all 'USERS'
//  First check to see if user is logged in
//  Then return the array with the user roles for an 'if' statement
router.get("/:id", isLoggedInOrders, isAuthorizedOrders, async (req, res, next) => {
  // find out if the userId._id and the OrderID's user._id match
  const orderUserMatch = await orderDAO.findMatchUserAndOrder(req.userId._id, req.params.id);
  // if they don't match and the user doesn't have admin priv's then prevent access
  if ( !orderUserMatch && !req.roles.includes('admin') ) { 
    res.status(404).send('Unable to Access');
  // else, they match! or you're admin, do some more work here
  } else if ( !orderUserMatch && req.roles.includes('admin')) {
    const adminRequest = await orderDAO.findByIdAdmin(req.params.id);
    req.requestedOrder = adminRequest;
    next();
  // keep variable already created and move on
  } else {
    req.requestedOrder = orderUserMatch;
    next();
  }
}, async (req, res, next) => {  
    // set up object and item array to push information into
    const expectedObject = {
      "items": [],
      "total": req.requestedOrder.total,
      "userId": req.requestedOrder.userId
    }
    try {
      // get information on every itemId in the order
      // req.requestedOrder.items.forEach(async (itemId) => {
      for (let index = 0; index < req.requestedOrder.items.length; index++) {
        const { price, title } = await itemDAO.findById(req.requestedOrder.items[index]);
        expectedObject.items.push({ 'price' : price, 'title' : title});
        // req.displayArray.push({ 'price' : price, 'title' : title});
        // console.log(expectedObject.items); // but this isn't empty!?
      }; // end loop

      // console.log(expectedObject.items); // items is empty?!
      res.status(200).json(expectedObject); 
    } catch (error) {
      console.log(error);
    }
    
}); // end GET /:id

//  Get all of my notes: `GET /items` for all 'USERS'
router.get("/", isLoggedInOrders, isAuthorizedOrders, async (req, res, next) => {
  if (req.roles.includes('admin')) {
    try {
      const adminOrders = await orderDAO.getOrdersAdmin();
      res.status(200).json(adminOrders); 
    } catch (error) {
      res.status(500).json(error); 
    }
  } else {
    try {
      const userOrders = await orderDAO.getOrdersUser(req.userId._id);
      // console.log(userOrders);
      res.status(200).json(userOrders); 
    } catch (error) {
      console.log(error);
      res.status(500).json(error); 
    }
  }
});

module.exports = router;

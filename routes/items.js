const { Router } = require("express");
const itemDAO = require('../daos/items');
const isLoggedIn = require('../middleware/isLoggedIn');
const isAuthorized = require('../middleware/isAuthorized');
const isLoggedInItems = require('../middleware/isLoggedInItems');
const hasItemDetails = require('../middleware/hasItemDetails');
const hasItem = require('../middleware/hasItem');
const router = Router();

// Create `POST /items`
router.post("/", isLoggedInItems, isAuthorized, hasItemDetails, async (req, res, next) => {
  const newItem = {
    "title": req.title,
    "price": req.price,
  };
  try {
    const itemCreated = await itemDAO.createItem(newItem); 
    res.status(200).json(itemCreated); 
  } catch(e) {
    res.status(500).send(e.message);
  }
});

// (PUT) Get a single item & update it: `PUT /items/:id` - for ADMIN ONLY
router.put("/:id", isLoggedInItems, isAuthorized, hasItem, async (req, res, next) => {
  req.price = req.body.price;
  req.title = req.body.title;
  if (!req.price && !req.title) {
    let error = 'No updates, must have price or title or both.';
    next(error);
  } else  next()
}, async (req, res, next) => {
  try {
    if (!req.price) {
      const udpatedItem = await itemDAO.updateItem(req.itemId, {'title': req.title});
      res.status(200).json(udpatedItem); 
    } else if (!req.title) {
      const udpatedItem = await itemDAO.updateItem(req.itemId, {'title': title});
      res.status(200).json(udpatedItem); 
    } else {
      const updates = { 
        'title': req.title,
        'price': req.price,
      }
      const udpatedItem = await itemDAO.updateItem(req.itemId, updates);
      res.status(200).json(udpatedItem); 
    }
  } catch (e) {
    next(e);
  }
});

//  Get all of my notes: `GET /items` for all 'USERS'
router.get("/:id", isLoggedIn, async (req, res, next) => {
  try {
    const items = await itemDAO.findById(req.params.id);
    res.status(200).json(items);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

//  Get all of my notes: `GET /items` for all 'USERS'
router.get("/", isLoggedIn, async (req, res, next) => {
  try {
    const items = await itemDAO.getItems();
    res.status(200).json(items);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

module.exports = router;

const express = require('express');
const itemController = require('../controller/itemController');

const router = express.Router();

router
  .route('/')
  .get(itemController.getAllItems)
  .post(itemController.createItem);

router.get('/get-all-items', itemController.getItems);

router
  .route('/:id')
  .get(itemController.getItem)
  .patch(itemController.updateItem)
  .delete(itemController.deleteItem);

module.exports = router;

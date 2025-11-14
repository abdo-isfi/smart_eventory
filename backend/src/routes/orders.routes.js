const express = require('express');
const ordersController = require('../controllers/orders.controller');
const auth = require('../middlewares/auth');
const authorize = require('../middlewares/authorize');
const validate = require('../middlewares/validate');
const orderValidation = require('../validators/order.validator');

const router = express.Router();
router.get('/', ordersController.getOrders);
router.get('/:id', ordersController.getOrder);


router.post('/', 
    auth, 
    authorize('user', 'admin'),
    validate(orderValidation.createOrder),
    ordersController.createOrder);

router.put(
  "/:id",
  auth,
  authorize("admin"),
  validate(orderValidation.updateOrder),
  ordersController.updateOrder
);

router.delete(
  "/:id",
  auth,
  authorize("admin"),
  ordersController.deleteOrder
);

module.exports = router;

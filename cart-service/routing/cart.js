const Cart = require("../controllers/carts.controller");
const express = require("express");
const router = express.Router();
const auth = require("../middleware/verifyAuth");
// Primary CRUD routes

router.get("/getCart/:id", Cart.getCart);
router.post("/createCart", Cart.createCart);
// need to add quantities as params in this uri
router.put("/updateCart/:id", Cart.updateCart);
router.delete("/deleteCart/:id", Cart.deleteCart);

// Buying action : Sends json format data to user service endpoint to be transformed into an order
router.get("/buyCart/", Cart.getCartContent);

module.exports = router;

const express = require("express")
const { createOrder, getOrderById, updateOrderToPaid, updateOrderToDelivered, getMyOrders, getAllOrders, createCheckOut } = require("../controllers/orderController")






const router = express.Router()
router.post("/create-order", createOrder)
router.get("/get-order/:id", getOrderById)
router.put("/order-paid/:id", updateOrderToPaid)
router.put("/order-delivered/:id", updateOrderToDelivered)
router.get("/my-orders", getMyOrders)
router.get("/all-orders", getAllOrders)
router.post("/checkout", createCheckOut)














module.exports = router
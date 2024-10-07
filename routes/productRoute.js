const express = require("express")
const { getAllProducts, getSingleProduct, createProduct, updateProduct, deleteProduct, getTopProduct } = require("../controllers/productController")
const upload = require("../middlewares/uploadMiddleware")
const { protect, admin } = require("../middlewares/authMiddleware")



const router = express.Router()
router.get('/gets-all-products', getAllProducts)
router.get("/get-single-product/:id", getSingleProduct)
router.post("/create-products", protect,admin, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'images', maxCount: 10 }]), createProduct)
router.put("/update-product/:id", updateProduct)
router.delete("/delete-product/:id", deleteProduct)
router.get("/get-top-product", getTopProduct)

















module.exports = router
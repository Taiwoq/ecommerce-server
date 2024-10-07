const express = require("express")
const { registerUser, userLogin, registerAdmin, adminLogin, forgetPassword, adminForgetPassword, getAllUsers, getSingleUser, resetPassword, updateUserProfile, updateAdminProfile } = require("../controllers/userController")
const { protect, admin } = require("../middlewares/authMiddleware")


const router = express.Router()
router.post("/register", registerUser)
router.post("/login", userLogin)
router.post("/register-admin",registerAdmin)
router.post("/login-admin",adminLogin)
router.post("/forgot-password", forgetPassword )
router.post("/forgot-password", adminForgetPassword)
router.put("/reset-password/:resetToken", resetPassword )
router.get("/get-all-users", protect, admin, getAllUsers)
router.get("/:id", getSingleUser)
router.put('/update-user-profile/:id', updateUserProfile)
router.put("/update-admin-profile/:id", updateAdminProfile)







module.exports = router
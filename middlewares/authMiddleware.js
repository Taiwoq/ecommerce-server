  const User = require("../models/userModels");
  const jwt = require("jsonwebtoken")
  require("dotenv").config()
  
  
  // middleware to check for authentication || to check if all users are logged in and have a token
  const protect = async (req, res, next) => {
      let token;
      if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
          // The space between the split is very important i.e space inbetween " "
          token = req.headers.authorization.split(" ")[1]
          const decoded = jwt.verify(token, process.env.JWT_SECRET)
    
          req.user = await User.findById(decoded.id).select("-password")
    
          if (!req.user) {
            return res.status(401).json({message : "Not authorised, User not found"})
          }
          next()
        } catch (error) {
          return res.status(401).json({message : "Not authorised, Token failed"})
        }
      }else{
        return res.status(401).json({message : "Not authorised, No token"})
    }
    }
  
  
  
  // middleware to check for authentication for admins || to check if isAdmin is = true
  const admin = (req, res, next) => {
      if (req.user && req.user.isAdmin) {
        next()
      }else{
        return res.status(403).json({message : "Not authorised as an Admin"})
    }
    }
  
  
  
  
  
  
  module.exports = {protect, admin}
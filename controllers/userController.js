const User = require("../models/userModels")
const generateToken = require("../utils/generateToken")
const bcrypt = require("bcryptjs")
const crypto = require("crypto")
const sendEmail = require("../utils/email")






const registerUser = async (req,res) =>{
    const {fullName,email,phone,password} = req.body

    const userExists = await User.findOne({email})
    if (userExists) {
        return  res.status(400).json({error:"User already exists..." })
      }

      const user = await User.create({fullName,email,phone,password})
    if (user) {
        const token = generateToken(user._id)
        res.cookie("jwt",token, {
            httpOnly : true,
            sameSite : "strict",
            maxAge : 30*24*60*60*1000,
        })

            res.status(201).json({
                message : "user registered successfully.....",
                user,
                token
            })
        } else{
            res.status(400).json({error: "Invalid user data"})
        }
}




const registerAdmin =  async (req,res) =>{
    const {fullName,email,phone,password} = req.body

    const adminExists = await User.findOne({email})
    if (adminExists) {
        return  res.status(400).json({error:"Admin already exists..." })
      }

      const admin = await User.create({fullName,email,phone,password, isAdmin:true})
    if (admin) {
        const token = generateToken(admin._id)
        res.cookie("jwt",token, {
            httpOnly : true,
            sameSite : "strict",
            maxAge : 30*24*60*60*1000,
        })

            res.status(201).json({
                message : "Admin registered successfully.....",
                admin,
                token
            })
        } else{
            res.status(400).json({error: "Invalid admin data"})
        }
}








const userLogin = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        const token = generateToken(user._id)

        res.cookie("jwt", token, {
            httpOnly : true,
            sameSite : "strict",
            maximumAge : 30*24*60*60*1000
        })

        
        res.status(200).json({
            message : "Logged in succesfully",
        user, token
        })
    } else {
        res.status(400).json({ error: "Invalid  user email or password" });
    }
}

const adminLogin = async (req, res) => {
    const { email, password } = req.body;

    const admin = await User.findOne({ email, isAdmin: true });

    if (admin && (await admin.matchPassword(password))) {
        const token = generateToken(admin._id)

        res.cookie("jwt", token, {
            httpOnly : true,
            sameSite : "strict",
            maximumAge : 30*24*60*60*1000
        })

        
        res.status(200).json({
            message : "Logged in succesfully",
        admin, token
        })
    } else {
        res.status(400).json({ error: "Invalid email or password" });
    }
}



const forgetPassword = async (req,res) =>{
    const {email} = req.body

    const user= await User.findOne({email})
    if(!user) {
        res.status(404)
        throw new Error("User not found")
    }

    // generate reset tokens
    const resetToken = crypto.randomBytes(32).toString("hex")
    user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex")
    user.resetPasswordExpire = Date.now() +10*60*1000

    await user.save()

    const resetUrl = `${req.protocol}://${req.get("host")}/api/users/reset-password/${resetToken}`
    const message = `You are recieving this email because you or someone else has requested a password reset. Please click the following link to reset password: \n\n ${resetUrl}`

    await sendEmail({
        email : user.email,
        subject : "password reset token",
        message : message
    })

    res.status(200).json({success : true, date : "Reset link sent to email......"})
}


const adminForgetPassword = async (req, res) => {
    const { email } = req.body;

    const admin = await User.findOne({ email, isAdmin: true });
    if (!admin) {
        res.status(404);
        throw new Error("Admin not found");
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    admin.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    admin.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    await admin.save();

    const resetUrl = `${req.protocol}://${req.get("host")}/api/admin/forget-password/${resetToken}`;
    const message = `You are receiving this email because you or someone else has requested a password reset for your admin account. Please click the following link to reset your password: \n\n ${resetUrl}`;

    await sendEmail({
        email: admin.email,
        subject: "Admin Password Reset Token",
        message: message
    });

    res.status(200).json({ success: true, data: "Reset link sent to email..." });
}


const resetPassword = async (req, res) => {
    const { resetToken } = req.params;
    const { password } = req.body;

    // Hash the token from the URL
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    // Find user by reset token and check if token has not expired
    const user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
        return res.status(400).json({ success: false, message: "Invalid or expired token" });
    }

    // Hash the new password
    user.password = await bcrypt.hash(password, 10);
    
    // Clear reset token and expiration fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({
        success: true,
        message: "Password reset successful"
    });
};




// getAllUsers function
const getAllUsers = async (req, res) => {
    try {
      // Fetch all users from the database
      const users = await User.find();
  
      if (users && users.length > 0) {
        // Return a successful response with the list of users
        res.status(200).json({
          message: "Users fetched successfully",
          users
        });
      } else {
        // Return a message when no users are found
        res.status(404).json({ message: "No users found" });
      }
    } catch (error) {
      // Handle any server errors
      res.status(500).json({ error: "Server error, please try again" });
    }
  };
  

  // New function to get a single user by ID
const getSingleUser = async (req, res) => {
    const { id } = req.params; // Get the user ID from the request parameters

    try {
        const user = await User.findById(id); // Find the user by ID
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({
            message: "User fetched successfully",
            user
        });
    } catch (error) {
        res.status(500).json({ error: "Server error, please try again" });
    }
};




const updateUserProfile = async (req, res) => {
    try {
      // Get the user ID from request parameters (or you can get it from the auth token)
      const userId = req.params.id;
  
      // Find the user by ID
      const user = await User.findById(userId);
  
      if (user) {
        // Update the fields if they are provided in the request body
        user.fullName = req.body.fullName || user.fullName;
        user.email = req.body.email || user.email;
        user.phone = req.body.phone || user.phone;
        if (req.body.password) {
          user.password = req.body.password; // Make sure to hash this password before saving
        }
  
        // Save the updated user to the database
        const updatedUser = await user.save();
  
        // Respond with the updated user information
        res.status(200).json({
          message: "User profile updated successfully",
          user: updatedUser
        });
      } else {
        // If user is not found, return 404 status
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      // Handle any server or database errors
      res.status(500).json({ error: "Server error, please try again" });
    }
  };


  const updateAdminProfile = async (req, res) => {
    try {
        // Get the admin ID from request parameters
        const adminId = req.params.id;

        // Find the admin by ID
        const admin = await User.findById(adminId);

        if (admin && admin.isAdmin) { // Ensure the user is an admin
            // Update the fields if they are provided in the request body
            admin.fullName = req.body.fullName || admin.fullName;
            admin.email = req.body.email || admin.email;
            admin.phone = req.body.phone || admin.phone;

            if (req.body.password) {
                // Hash the new password before saving
                admin.password = await bcrypt.hash(req.body.password, 10);
            }

            // Save the updated admin to the database
            const updatedAdmin = await admin.save();

            // Respond with the updated admin information
            res.status(200).json({
                message: "Admin profile updated successfully",
                admin: updatedAdmin
            });
        } else {
            // If admin is not found or not an admin, return 404 status
            res.status(404).json({ message: "Admin not found" });
        }
    } catch (error) {
        // Handle any server or database errors
        console.error(error);
        res.status(500).json({ error: "Server error, please try again" });
    }
};



module.exports = {registerUser, userLogin, registerAdmin, adminLogin, forgetPassword, adminForgetPassword, resetPassword, getAllUsers, getSingleUser, updateUserProfile, updateAdminProfile}
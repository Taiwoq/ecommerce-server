const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const userSchema = mongoose.Schema({
    fullName : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    phone : {
        type : Number,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true
    },

    isAdmin : {
        default : false,
        type : Boolean,
        required : true
    },

    // reset password
    resetPasswordToken : String,
    resetPasswordExpire : Date,
},{
    timestamps : true
})

userSchema.pre("save",async function(next){
    if (!this.isModified("password")) {
        return next()
    }

    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

// middleware to compare entered password with encrypted password

userSchema.methods.matchPassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password)
}

module.exports = mongoose.model("User",userSchema)
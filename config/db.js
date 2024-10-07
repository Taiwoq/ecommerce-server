const mongoose = require("mongoose")
require("dotenv").config()

const connectDb = async () => {
    try {
        const connect = await mongoose.connect(process.env.MONGO_URI);
        console.log(`mongodb connected successfully on : ${connect.connection.host}`);
        
    } catch (error) {
       console.log(`Error: ${error.message}`);
        
    }
};




module.exports = connectDb
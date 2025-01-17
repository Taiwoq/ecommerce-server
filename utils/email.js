const { text } = require("express")
const nodemailer = require("nodemailer")
require("dotenv").config

const sendMail = async (options) => {
    const trasporter = nodemailer.createTransport({
     service : "Gmail",
     auth : {
        user : process.env.EMAIL_USERNAME,
        pass : process.env.EMAIL_PASSWORD
       },
    })
    const mailOptions = {
        from : process.env.EMAIL_USERNAME,
        to : options.email,
        subject : options.subject,
        text : options.message
    }
    try {
        await trasporter.sendMail(mailOptions)
        console.log("Email sent succesfully...");
        
    } catch (error) {
        console.log(`${error} : Error sending mail`);

        const errorMessage = error.message?.includes("ECONNREFUSED")
        ? "There seems to be a problem with the email server connection"
        : (error.message?.includes("Invalid login")
        ? "The provided email credentials might be incorrect. Please check your dotenv file "
        : "An error occured whilst sending the password reset email" )

        throw new Error(errorMessage)
   
    }
}


module.exports = sendMail
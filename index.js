const express = require("express")
const app = express()
const port = 3030

const connectDb = require("./config/db")
connectDb()

const userRoute = require("./routes/userRoute")
const productRoute = require("./routes/productRoute")
const orderRoute = require("./routes/orderRoute")

// this allows to use json format
app.use(express.json())
// to use url encoded values instead of json
app.use(express.urlencoded({extended : true}))


app.get("/api", (req,res) => {
    res.json(
        {message:"welcome to the server....."}
    )
})

app.use("/api/users", userRoute)
app.use("/api/products", productRoute)
app.use("/api/orders", orderRoute)







app.listen(port, () => {
    console.log("server connected successfully....");
    
})





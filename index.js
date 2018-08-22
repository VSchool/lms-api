//dependencies
const express = require("express")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
require("dotenv").config()
const morgan = require("morgan")
const app = express()

//middleware
app.use(bodyParser.json())
app.use(morgan("dev"))

//routes
app.use("/api", require("./routes/"))
app.use("/auth", require("./routes/auth/"))

mongoose.connect(process.env.MONGODB_URI, (err) => {
    if (err) throw err
    console.log(`Connected to MongoDB on ${process.env.MONGODB_URI}`)
})

app.listen(process.env.PORT, () => {
    console.log(`Connected to Server on port ${process.env.PORT}`)
})

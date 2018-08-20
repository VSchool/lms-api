//dependencies
const express = require("express")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
require("dotenv").config()

//imports

//initializations
const app = express()

//middleware
app.use(bodyParser.json())

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

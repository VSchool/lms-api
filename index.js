//dependencies
require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const path = require("path")
const morgan = require("morgan")
const app = express()

// middleware
app.use(bodyParser.json())
app.use(morgan("dev"))
app.use(express.static(path.join(__dirname, "static")))

// routes
app.use("/api/v1", require("./routes"))

app.get("/docs", (req, res) => {
    res.sendFile(path.join(__dirname, "static", "docs", "index.html"))
})

// connect to database
mongoose.connect(process.env.MONGODB_URI, (err) => {
    if (err) throw err
    console.log(`Connected to MongoDB on ${process.env.MONGODB_URI}`)
})

app.listen(process.env.PORT, () => {
    console.log(`Connected to Server on port ${process.env.PORT}`)
})

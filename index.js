//dependencies
const express = require("express");
const mongoose = require("mongoose");
const bp = require("body-parser");
require("dotenv").config();

//imports

//initializations
const app = express();

//middleware
app.use(bp.json());

//routes
app.use("/api", require("./routes/api/"));
app.use("/auth", require("./routes/auth/"));

mongoose.connect(process.env.MONGODB_URI, (err) => {
    if (err)
        console.error(err);
    else
        app.listen(process.env.PORT, () => console.log(`Connected to MongoDB on ${process.env.MONGODB_URI}\nConnected to Server on port ${process.env.PORT}`))
});


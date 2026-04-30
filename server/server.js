require('dotenv').config()
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
app.use(cors("*"));
app.use(express.static("./public"))
app.use(express.json());
app.use("/api/category", require("./routers/categoryRouter"));
app.use("/api/brand", require("./routers/brandRouter"));
app.use("/api/color", require("./routers/colorRouter"));
app.use("/api/product", require("./routers/productRouter"));

mongoose.connect(process.env.MONGODB_URL).then(
    () => {
        console.log("Database connected");

        app.listen(
            process.env.PORT,
            () => {
                console.log("Server started");

            }
        )
    }
).catch(
    (error) => {
        console.log("Database not connected");

    }
)
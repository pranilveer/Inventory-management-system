const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require("cors");
dotenv.config();

const app = express();

const authRouter = require("./routes/authRoutes");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use("/", authRouter);


app.get('/', (req, res) =>{
    res.status(200).json({
        server: "Running",
    })
})

app.get("/health", (req, res) => {
    const dbStatus = mongoose.connection.readyState === 1 ? "Connected" : "Disconnected";

    res.status(200).json({
        server: "Running",
        database: dbStatus,
    });
});

app.use((req, res, next) => {
    const error = new Error("Not found");
    error.status = 404;
    next(error);
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res
        .status(500)
        .json({ error: "Something went wrong! Please try again later." });
});

module.exports = app;
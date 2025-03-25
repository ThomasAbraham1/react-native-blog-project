const express = require('express');
var jwt = require('jsonwebtoken');
const app = express();
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const { router } = require('./routes/routes')
const cookieParser = require("cookie-parser");
const cors = require('cors');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json());
// Use cookieParser
app.use(cookieParser());
app.use(cors({
    // origin: ["https://blog-react-1bg2.onrender.com, https://main--tomsblog.netlify.app/"],
    origin: ["http://localhost:5173", "http://localhost:8081",
        "exp://192.168.1.43:8081"],
    methods: ["GET", "POST"],
    credentials: true,
}));


app.use("/", router);

app.listen(port, (req, res) => {
    console.log("App listening to port 3000");
});
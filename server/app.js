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
    origin: [
      "https://react-native-blog--ai06ccfss9.expo.app", // Your Expo app URL
      "http://localhost:3000", // Local backend testing (optional)
      "http://localhost:8081", // Local Expo dev (optional)
      "exp://192.168.1.43:8081", // Local Expo Go (optional)
    ],
    methods: ["GET", "POST", "PUT", "DELETE"], // Include all methods you use
    credentials: true, // If you’re using cookies/JWT with credentials
  }));


app.use("/", router);

app.listen(port, (req, res) => {
    console.log("App listening to port 3000");
});
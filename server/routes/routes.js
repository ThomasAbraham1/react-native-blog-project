const {registerController} = require('../controllers/registerControllers');
const {homeController} = require('../controllers/homeController');
const {publishPostController} = require('../controllers/publishPostController');
const {loginController} = require('../controllers/loginController');
const {deleteController} = require('../controllers/deleteController');
const {updateController} = require('../controllers/updateController');
const {oAuthRedirect} = require('../controllers/oAuth');
const {oAuthGoogleCallback} = require('../controllers/oAuth');
const {oAuthFacebookCallback} = require('../controllers/oAuth');

const express = require('express')
const router = express.Router();


router.post("/register", registerController);
router.get("/:userId", homeController);
router.post("/post/:userId", publishPostController);
router.post("/login", loginController);
router.post("/delete/:userId", deleteController);
router.post("/update/:userId", updateController);
router.post("/oauth", oAuthRedirect);
router.get("/google/auth", oAuthGoogleCallback);
router.get("/facebook/auth", oAuthFacebookCallback);


module.exports={
    router
}

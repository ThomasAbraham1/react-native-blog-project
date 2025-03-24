const { userModel } = require('../db');
var jwt = require('jsonwebtoken');


async function registerController(req, res) {
    const userName = req.body.userName;
    const password = req.body.password;
    console.log('userName: ' + userName + ' Password: ' + password);
    userModel.create({ username: userName, password: password
        // , posts: [{ postTitle: "kjlj", postContent: "lkjlkj" }]
         }).then((data) => {
        console.log(data);
        const id = data._id;
        const token = jwt.sign({ id }, 'bar', { expiresIn: 1 * 24 * 60 * 60 });
        res.cookie("jwt", token, {
            withCredentials: true,
            httpOnly: false,
            maxAge: 1 * 24 * 60 * 60 * 1000, 
        });
        res.status(200).json({
            userId: data._id,
            message: "Registered the user!",
        })
    }).catch((err) => {
        if (err.code == 11000) {
            res.status(403).json({
                message: "Account already registered, sign in"
            })
        }
        console.log(err);
        console.log("error exists");
    })
}

module.exports = {
    registerController
}
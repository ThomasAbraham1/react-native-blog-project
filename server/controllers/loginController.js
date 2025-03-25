const { userModel } = require('../db');
var jwt = require('jsonwebtoken');


async function loginController(req, res) {
    const userName = req.body.userName;
    const password = req.body.password;
    console.log('Email: ' + userName + ' Password: ' + password);
    userModel.findOne({ username: userName }).then((data) => {
        if(data == null) throw {code: 11000}
        if(!data.password) throw {code: 11001}
        if (password != data.password) {
            throw 'p';
        }
        console.log(data);
        const id = data._id;
        const token = jwt.sign({ id }, 'bar', { expiresIn: 1 * 24 * 60 * 60 });
        res.cookie("jwt", token, {
            withCredentials: true,
            httpOnly: false,
            maxAge: 1 * 24 * 60 * 60 * 1000,
        });
        res.status(200).json({
            token: token,
            userId: data._id,
            message: "User is welcome!",
        })
    }).catch((err) => {
        if (err.code == 11000) {
            res.status(403).json({
                message: "Email does not exist" 
            })
        } 
        if (err.code == 11001) {
            res.status(403).json({
                message: "You're OAuth user, try social logins"
            })
        }
        if (err == 'p') {
            res.status(403).json({
                message: "Password does not match"
            })
        }
        console.log(err);
        console.log("error exists");
    })
}

module.exports = {
    loginController
}
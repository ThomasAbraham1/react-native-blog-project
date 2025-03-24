var jwt = require('jsonwebtoken');
const { userModel } = require('../db');


 
const authorize = async (req, res, { operation, test }) => {
    var token = req.cookies.jwt;
    // When token has been destroyed by client - Logout condition
    if (!token) {
        res.status(409).json({
            isExpired: true,
            message: "Session is over!"
        })
        return
    }
    jwt.verify(token, 'bar', async (err, token) => {
        if (err) {
            res.status(409).json({
                isExpired: true,
                message: "Token expired"
            })
            return
        }
        id = token.id;
        // Check if user is available in database
        const data = await userModel.findOne({ _id: id })
        if (data == null) {
            console.log("monkey")
            // If not, expire the session
            res.status(409).json({
                isExpired: true,
                message: "Token expired"
            })
            return
        }
        // Handle operations along with authorization
        if (operation) {
            operation({ id: id });
            return
        }
        // Handle only authorization when test is set
        if (test) {
            res.status(200).json({
                isExpired: false,
                message: "Token is still valid",
            })
            return
        }


    })
}
module.exports = {
    authorize
}
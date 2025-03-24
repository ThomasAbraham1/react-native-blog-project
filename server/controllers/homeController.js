const { userModel } = require('../db');
var jwt = require('jsonwebtoken');
const { authorize } = require('../auth');


async function homeController(req, res, next) {
    // Finding the posts of user, while authorizing their request also
    async function getPosts({ id }) {
        try {
            await userModel.findOne({ _id: id }).then((data) => {
                // console.log(data.posts);
                res.status(200).json({
                    isExpired: false,
                    message: "Token is still valid",
                    data: data
                })
                return
            })
        }catch(err){
            console.log(err);
        }
    }
    authorize(req, res, { operation: getPosts, test: 1 });
}

module.exports = { homeController }
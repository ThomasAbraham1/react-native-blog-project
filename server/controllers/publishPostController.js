const { query } = require('express');
const { userModel } = require('../db');
const { authorize } = require('../auth');

// Controller for posting blog posts
const publishPostController = async (req, res) => {
    async function postFunction({id}) {
        const userId = id;
        const postTitle = req.body.postTitle;
        const postContent = req.body.postContent;
        // Find the user and push the post
        await userModel.findOne({ _id: userId }).then((user) => {
            user.posts.push({
                postTitle: postTitle,
                postContent: postContent,
            });
            user.save().then((data) => {
                res.status(200).json({
                    isExpired: false, 
                    message: "Pushed the post content into users collection"
                }) 
            })
        }).catch((err) => {
            console.log(err);
        });
    }
    authorize(req,res, {operation: postFunction, test:1})
}

module.exports = {
    publishPostController
}
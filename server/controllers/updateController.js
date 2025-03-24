const { userModel } = require('../db');
const { authorize } = require('../auth');

// For deleting the post
async function updateController(req,res){

    async function updatePostOperation({id}){
        userModel.findOneAndUpdate({_id:id, "posts._id": req.body.id}, {$set:{"posts.$.postTitle": req.body.postTitle, "posts.$.postContent": req.body.postContent}}, {returnDocument:'after'}).then((data)=>{
            console.log(data + "hello");
            res.status(200).json({
                isExpired: false,
                message: "Token is still valid",
                data:"Post deleted"
            })
        }).catch((err)=>{
            console.log(err);
        })
    }
    authorize(req,res,{operation:updatePostOperation});
}

module.exports={
    updateController
}
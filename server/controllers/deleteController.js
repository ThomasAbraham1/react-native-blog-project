const { userModel } = require('../db');
const { authorize } = require('../auth');

// For deleting the post
async function deleteController(req,res){

    async function deletePostOperation({id}){
        userModel.findOneAndUpdate({_id:id}, {$pull: {posts: {_id:req.body.postId}}}).then((data)=>{
            console.log(data);
            res.status(200).json({
                isExpired: false,
                message: "Token is still valid",
                data:"Post deleted"
            })
        }).catch((err)=>{
            console.log(err);
        })
    }
    authorize(req,res,{operation:deletePostOperation});
}

module.exports={
    deleteController
}
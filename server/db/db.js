const mongoose = require('mongoose');
let postModel;
let userModel;
// Connection to database

// mongoose.connect('mongodb://localhost:27017/blog').then(() => {
    mongoose.connect("mongodb+srv://cta102938:i0MMJrY899VLTL82@cluster0.qesx1ag.mongodb.net/blog").then(() => {
    console.log("Connected to DB");
}).catch((err) => {
    console.log(err);
});

const Schema = mongoose.Schema;

const Post = new Schema({
    postTitle: String,
    postContent: String,


});
const User = new Schema({
    username: {
        type: String,
        unique: true,
    },
    email: {
        type: String,
    },
    password: {
        type: String,
    },
    profilePic: {
        type: String,
    },
    posts: [Post],
});

userModel = mongoose.model('user', User);




module.exports = {
    userModel,
}


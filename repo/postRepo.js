const Post = require('../model/postModel');

const createPost = async (postData) => {
    const post = new Post(postData);
    await post.save();
    return post;
};
const getAllPosts = async () => {
    return await Post.find();
};
module.exports = { createPost, getAllPosts };
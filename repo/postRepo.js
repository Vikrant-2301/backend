const Post = require('../model/postModel');

class PostRepository {
    // Create a new post
    async createPost(postData) {
        const post = new Post(postData);
        return await post.save();
    }

    // Get post by ID
    async getPostById(postId) {
        return await Post.findById(postId);

    }

     async getAllPosts() {
        return await Post.find();
    };

    // Add a vote to a post
    async addVote(postId, userId) {
        const post = await Post.findById(postId);
        if (!post) throw new Error('Post not found');
        await post.addVote(userId);
        return post;
    }

    // Remove a vote from a post
    async removeVote(postId, userId) {
        const post = await Post.findById(postId);
        if (!post) throw new Error('Post not found');
        await post.removeVote(userId);
        return post;
    }

    // delete post by _id 
    async deletePost(postId) {
        return await Post.findByIdAndDelete(postId);
    }
}

module.exports = new PostRepository();
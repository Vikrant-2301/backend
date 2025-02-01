// services/postService.js
const postRepository = require('../repo/postRepo');

class PostService {
    // Create a new post
    async createPost(postData) {
        return await postRepository.createPost(postData);
    }

    // Get post by ID
    async getPostById(postId) {
        const post = await postRepository.getPostById(postId);
        if (!post) throw new Error('Post not found');
        return post;
    }

    // Add a vote to a post
    async addVote(postId, userId) {
        return await postRepository.addVote(postId, userId);
    }

    // Remove a vote from a post
    async removeVote(postId, userId) {
        return await postRepository.removeVote(postId, userId);
    }

    // Get all posts
    async getAllPosts() {
        return await postRepository.getAllPosts();
    }

    // Delete a post
    async deletePost(postId) {
        return await postRepository.deletePost(postId);
    }
}

module.exports = new PostService();
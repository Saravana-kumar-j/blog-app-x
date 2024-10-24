// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DecentralizedBlog {
    // Blog post structure
    struct Post {
        uint id;
        string title;
        string content;
        address author;
        uint timestamp;
    }

    // List of all posts
    Post[] public posts;

    // Event to notify frontend of a new post
    event NewPost(uint id, string title, address author);

    // Function to create a new blog post
    function createPost(string memory _title, string memory _content) public {
        uint postId = posts.length;
        posts.push(Post(postId, _title, _content, msg.sender, block.timestamp));
        emit NewPost(postId, _title, msg.sender);
    }

    // Function to get a post by its ID
    function getPost(uint _postId) public view returns (string memory, string memory, address, uint) {
        Post memory post = posts[_postId];
        return (post.title, post.content, post.author, post.timestamp);
    }

    // Function to get the number of posts
    function getPostCount() public view returns (uint) {
        return posts.length;
    }
}

'use client';

import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { contractADDRESS, contractAbi } from '../utils'; // Import contract details
import toast, { Toaster } from 'react-hot-toast';

const Blog = () => {
  const [account, setAccount] = useState(null); // User's Ethereum address from cache
  const [contract, setContract] = useState(null); // Contract instance
  const [posts, setPosts] = useState([]); // List of posts
  const [newPost, setNewPost] = useState({ title: '', content: '' }); // New post input

  // Fetch the cached Ethereum address from localStorage (set in SignIn)
  useEffect(() => {
    const cachedAddress = localStorage.getItem('userAddress'); // Assuming 'SignIn' caches the address
    if (cachedAddress) {
      setAccount(cachedAddress); // Set the cached address
    } else {
      toast.error('No address found in cache. Please sign in again.');
    }
  }, []);

  // Initialize contract once the cached account is available
  useEffect(() => {
    const initContract = async () => {
      if (account && window.ethereum) {
        try {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          const blogContract = new ethers.Contract(contractADDRESS, contractAbi, signer);

          setContract(blogContract); // Set contract instance
        } catch (error) {
          toast.error(`Error: ${error.message}`);
        }
      }
    };
    initContract();
  }, [account]);

  // Create a new blog post
  const createPost = async () => {
    if (!contract || !account) {
      toast.error('Please connect to MetaMask');
      return;
    }

    try {
      const toastId = toast.loading('Creating post...');
      const tx = await contract.createPost(newPost.title, newPost.content);
      await tx.wait();

      setNewPost({ title: '', content: '' }); // Reset form after success
      fetchPosts(); // Fetch updated posts
      toast.success('Post created successfully');
      toast.dismiss(toastId); // Dismiss the loading toast after success
    } catch (error) {
      toast.dismiss(); // Dismiss loading toast if there's an error
      toast.error(`Error: ${error.message}`);
    }
  };

  // Fetch all posts from the contract (in reverse order, latest first)
  const fetchPosts = async () => {
    if (!contract) return;

    try {
      const postCount = await contract.getPostCount();
      const postArray = [];
      for (let i = postCount - 1; i >= 0; i--) { // Reverse order
        const post = await contract.getPost(i);
        postArray.push({
          id: i,
          title: post[0],
          content: post[1],
          author: post[2],
          timestamp: new Date(post[3] * 1000).toLocaleString(),
        });
      }
      setPosts(postArray);
    } catch (error) {
      toast.error(`Error fetching posts: ${error.message}`);
    }
  };

  // Load posts when contract is ready
  useEffect(() => {
    if (contract) {
      fetchPosts();
    }
  }, [contract]);

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <h1 className="text-3xl font-bold text-center text-black mb-6">Decentralized Blog</h1>
      <Toaster position="top-center" />

      {!account ? (
        <p className="text-center text-black">No account found. Please sign in.</p>
      ) : (
        <div>
          <p className="text-center text-black mb-6">Connected as: {account}</p>

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-black mb-4">Create a New Post</h2>
            <input
              type="text"
              placeholder="Post Title"
              value={newPost.title}
              onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
              className="border p-2 rounded-lg w-full mb-4"
            />
            <textarea
              placeholder="Post Content"
              value={newPost.content}
              onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
              className="border p-2 rounded-lg w-full mb-4"
            />
            <button
              onClick={createPost}
              className="bg-green-500 text-white py-2 px-4 rounded-lg w-full"
            >
              Submit Post
            </button>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-black mb-4">All Posts</h2>
            <div className="h-64 overflow-y-auto border p-4 rounded-lg">
              {posts.length === 0 ? (
                <p className="text-black">No posts yet. Be the first to create one!</p>
              ) : (
                posts.map((post) => (
                  <div key={post.id} className="border-b p-4 mb-2">
                    <h3 className="font-bold text-lg text-black mb-2">{post.title}</h3>
                    <p className="text-black">{post.content}</p>
                    <p className="text-gray-600 text-sm mt-2">By: {post.author}</p>
                    <p className="text-gray-600 text-sm">On: {post.timestamp}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Blog;

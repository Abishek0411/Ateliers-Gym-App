'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import PostForm from '@/components/PostForm';
import PostCard from '@/components/PostCard';
import Navigation from '@/components/Navigation';
import CloudinaryConfig from '@/components/CloudinaryConfig';
import { Post, CreatePostData, User } from '@/types/community';
import { communityApi } from '@/lib/api/community';
import { Users, Plus } from 'lucide-react';

export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPostForm, setShowPostForm] = useState(false);
  const router = useRouter();

  const checkAuthAndLoadData = useCallback(async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        router.push('/login');
        return;
      }

      // Load user data and posts in parallel
      await Promise.all([loadUserProfile(token), loadPosts(token)]);
    } catch (error) {
      console.error('Failed to load community data:', error);
      setError('Failed to load community data');
    } finally {
      setIsLoading(false);
      // Global navigation loading handles the loading state automatically
    }
  }, [router]);

  useEffect(() => {
    checkAuthAndLoadData();
  }, [checkAuthAndLoadData]);

  const loadUserProfile = async (token: string) => {
    try {
      const response = await fetch('http://192.168.0.103:3001/auth/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      }
    } catch (error) {
      console.error('Failed to load user profile:', error);
    }
  };

  const loadPosts = async (token: string) => {
    try {
      const response = await fetch('http://192.168.0.103:3001/community/feed', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const postsData = await response.json();
        setPosts(postsData);
      } else {
        throw new Error('Failed to load posts');
      }
    } catch (error) {
      console.error('Failed to load posts:', error);
      throw error;
    }
  };

  const handleCreatePost = async (postData: CreatePostData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch('http://192.168.0.103:3001/community/post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        throw new Error('Failed to create post');
      }

      const newPost = await response.json();
      setPosts(prev => [newPost, ...prev]);
      setShowPostForm(false);
    } catch (error) {
      console.error('Failed to create post:', error);
      setError('Failed to create post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch(
        `http://192.168.0.103:3001/community/${postId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to delete post');
      }

      setPosts(prev => prev.filter(post => post._id !== postId));
    } catch (error) {
      console.error('Failed to delete post:', error);
      setError('Failed to delete post. Please try again.');
    }
  };

  const handleLikeToggle = async (postId: string) => {
    try {
      const response = await communityApi.toggleLike(postId);

      setPosts(prev =>
        prev.map(post =>
          post._id === postId
            ? {
                ...post,
                likes: response.liked
                  ? [...post.likes, user?.gymId || '']
                  : post.likes.filter(id => id !== user?.gymId),
              }
            : post
        )
      );
    } catch (error) {
      console.error('Failed to toggle like:', error);
    }
  };

  const handleCommentAdd = async (postId: string, text: string) => {
    try {
      const newComment = await communityApi.addComment(postId, text);

      setPosts(prev =>
        prev.map(post =>
          post._id === postId
            ? { ...post, comments: [...post.comments, newComment] }
            : post
        )
      );
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  const handleCommentDelete = async (postId: string, commentId: string) => {
    try {
      await communityApi.deleteComment(postId, commentId);

      setPosts(prev =>
        prev.map(post =>
          post._id === postId
            ? {
                ...post,
                comments: post.comments.filter(
                  comment => comment._id !== commentId
                ),
              }
            : post
        )
      );
    } catch (error) {
      console.error('Failed to delete comment:', error);
    }
  };

  const refreshPosts = async () => {
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        await loadPosts(token);
      } catch (error) {
        console.error('Failed to refresh posts:', error);
      }
    }
  };

  // Removed page-level loading - global navigation loading handles this smoothly

  return (
    <div className="min-h-screen bg-gradient-to-br from-atelier-navy via-black to-atelier-darkRed">
      <CloudinaryConfig />
      <Navigation currentPage="community" />
      <div className="container mx-auto px-4 py-8 pt-20 pb-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Users className="w-8 h-8 text-atelier-darkYellow" />
            <h1 className="text-4xl font-bold text-white">Community</h1>
          </div>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Share your workouts, get inspired, and connect with fellow Atelier's
            members
          </p>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 mb-6 text-red-300"
          >
            {error}
          </motion.div>
        )}

        {/* Post Form Toggle */}
        {user && (
          <div className="flex justify-center mb-8">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowPostForm(!showPostForm)}
              className="flex items-center space-x-2 bg-gradient-to-r from-atelier-darkYellow to-atelier-darkRed text-black px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-atelier-darkYellow/25 transition-all"
            >
              <Plus className="w-5 h-5" />
              <span>{showPostForm ? 'Cancel' : 'Create Post'}</span>
            </motion.button>
          </div>
        )}

        {/* Post Form */}
        {showPostForm && user && (
          <div className="max-w-2xl mx-auto mb-8">
            <PostForm onSubmit={handleCreatePost} isSubmitting={isSubmitting} />
          </div>
        )}

        {/* Posts Feed */}
        <div className="max-w-4xl mx-auto space-y-6">
          {posts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <Users className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">
                No posts yet
              </h3>
              <p className="text-gray-500">
                Be the first to share your workout with the community!
              </p>
            </motion.div>
          ) : (
            posts.map((post, index) => (
              <PostCard
                key={post._id}
                post={post}
                currentUser={user}
                onDelete={handleDeletePost}
                onLikeToggle={handleLikeToggle}
                onCommentAdd={handleCommentAdd}
                onCommentDelete={handleCommentDelete}
                index={index}
              />
            ))
          )}
        </div>

        {/* Refresh Button */}
        {posts.length > 0 && (
          <div className="flex justify-center mt-8">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={refreshPosts}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
            >
              Refresh Feed
            </motion.button>
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Post, User } from '@/types/community';
import { communityApi, ApiError } from '@/lib/api/community';
import MyPostCard from '@/components/MyPostCard';
import PostEditorModal from '@/components/PostEditorModal';
import Navigation from '@/components/Navigation';
import {
  Search,
  Filter,
  Plus,
  Loader2,
  AlertCircle,
  FileText,
  Image,
  Video,
  Trophy,
} from 'lucide-react';

type FilterType = 'all' | 'images' | 'videos' | 'challenges';

export default function MyPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [hasMore, setHasMore] = useState(true);
  const [nextCursor, setNextCursor] = useState<string | undefined>();
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [showPostForm, setShowPostForm] = useState(false);
  const router = useRouter();

  const loadPosts = useCallback(
    async (cursor?: string, append = false) => {
      try {
        const response = await communityApi.getMyPosts(20, cursor);

        if (append) {
          setPosts(prev => [...prev, ...response.posts]);
        } else {
          setPosts(response.posts);
        }

        setHasMore(response.hasMore);
        setNextCursor(response.nextCursor);
      } catch (error) {
        console.error('Failed to load posts:', error);
        if (error instanceof ApiError && error.status === 401) {
          router.push('/login');
        } else {
          setError('Failed to load posts');
        }
      }
    },
    [router]
  );

  const checkAuthAndLoadData = useCallback(async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        router.push('/login');
        return;
      }

      const userData = localStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }

      await loadPosts();
    } catch (error) {
      console.error('Failed to load my posts:', error);
      setError('Failed to load your posts');
    } finally {
      setIsLoading(false);
    }
  }, [router, loadPosts]);

  const loadMorePosts = async () => {
    if (!hasMore || isLoadingMore) return;

    setIsLoadingMore(true);
    try {
      await loadPosts(nextCursor, true);
    } catch (error) {
      console.error('Failed to load more posts:', error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handlePostUpdate = (updatedPost: Post) => {
    setPosts(prev =>
      prev.map(post => (post._id === updatedPost._id ? updatedPost : post))
    );
    setEditingPost(null);
  };

  const handlePostDelete = (postId: string) => {
    setPosts(prev => prev.filter(post => post._id !== postId));
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

  useEffect(() => {
    checkAuthAndLoadData();
  }, [checkAuthAndLoadData]);

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.text
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesFilter =
      filter === 'all' ||
      (filter === 'images' && post.mediaType === 'image') ||
      (filter === 'videos' && post.mediaType === 'video') ||
      (filter === 'challenges' && post.workoutSplit === 'Other');

    return matchesSearch && matchesFilter;
  });

  const filterOptions = [
    { id: 'all', label: 'All Posts', icon: FileText, count: posts.length },
    {
      id: 'images',
      label: 'Images',
      icon: Image,
      count: posts.filter(p => p.mediaType === 'image').length,
    },
    {
      id: 'videos',
      label: 'Videos',
      icon: Video,
      count: posts.filter(p => p.mediaType === 'video').length,
    },
    {
      id: 'challenges',
      label: 'Challenges',
      icon: Trophy,
      count: posts.filter(p => p.workoutSplit === 'Other').length,
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-atelier-navy via-black to-atelier-darkRed flex items-center justify-center">
        <Navigation currentPage="profile" />
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-atelier-darkYellow mx-auto mb-4" />
          <p className="text-white">Loading your posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-atelier-navy via-black to-atelier-darkRed">
      <Navigation currentPage="profile" />

      <div className="container mx-auto px-4 py-8 pt-20 pb-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">My Posts</h1>
          <p className="text-gray-300">
            Manage your fitness journey and community contributions
          </p>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search your posts..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-atelier-darkYellow focus:border-transparent"
              />
            </div>

            {/* Create New Post Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowPostForm(true)}
              className="px-6 py-3 bg-gradient-to-r from-atelier-darkYellow to-atelier-darkRed text-black font-semibold rounded-xl hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>New Post</span>
            </motion.button>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2">
            {filterOptions.map(option => {
              const Icon = option.icon;
              const isActive = filter === option.id;

              return (
                <motion.button
                  key={option.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setFilter(option.id as FilterType)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-atelier-darkYellow text-black'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{option.label}</span>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      isActive ? 'bg-black/20' : 'bg-white/20'
                    }`}
                  >
                    {option.count}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl flex items-center space-x-3"
          >
            <AlertCircle className="w-5 h-5 text-red-400" />
            <span className="text-red-300">{error}</span>
          </motion.div>
        )}

        {/* Posts Grid */}
        {filteredPosts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No posts found
            </h3>
            <p className="text-gray-400 mb-6">
              {searchQuery || filter !== 'all'
                ? 'Try adjusting your search or filter criteria'
                : 'Start sharing your fitness journey with the community'}
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowPostForm(true)}
              className="px-6 py-3 bg-gradient-to-r from-atelier-darkYellow to-atelier-darkRed text-black font-semibold rounded-xl hover:shadow-lg transition-all duration-200"
            >
              Create Your First Post
            </motion.button>
          </motion.div>
        ) : (
          <div className="grid gap-6">
            {filteredPosts.map((post, index) => (
              <motion.div
                key={post._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <MyPostCard
                  post={post}
                  currentUser={user}
                  onUpdate={handlePostUpdate}
                  onDelete={handlePostDelete}
                  onLikeToggle={handleLikeToggle}
                  onCommentAdd={handleCommentAdd}
                  onCommentDelete={handleCommentDelete}
                />
              </motion.div>
            ))}
          </div>
        )}

        {/* Load More Button */}
        {hasMore && filteredPosts.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mt-8"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={loadMorePosts}
              disabled={isLoadingMore}
              className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 mx-auto"
            >
              {isLoadingMore ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Loading more posts...</span>
                </>
              ) : (
                <span>Load More Posts</span>
              )}
            </motion.button>
          </motion.div>
        )}
      </div>

      {/* Post Editor Modal */}
      {editingPost && (
        <PostEditorModal
          post={editingPost}
          onSave={handlePostUpdate}
          onClose={() => setEditingPost(null)}
        />
      )}

      {/* Post Form Modal */}
      {showPostForm && (
        <PostEditorModal
          onSave={newPost => {
            setPosts(prev => [newPost, ...prev]);
            setShowPostForm(false);
          }}
          onClose={() => setShowPostForm(false)}
        />
      )}
    </div>
  );
}

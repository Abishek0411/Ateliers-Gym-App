'use client';

import { motion } from 'framer-motion';
import { CldImage, CldVideoPlayer } from 'next-cloudinary';
import { Post, User, Comment } from '@/types/community';
import {
  Heart,
  MessageCircle,
  Edit,
  Trash2,
  Clock,
  User as UserIcon,
  Shield,
  Crown,
  MoreVertical,
  X,
} from 'lucide-react';
import { useState } from 'react';
import CommentComposer from './CommentComposer';

interface MyPostCardProps {
  post: Post;
  currentUser?: User | null;
  onUpdate?: (updatedPost: Post) => void;
  onDelete?: (postId: string) => void;
  onLikeToggle?: (postId: string) => void;
  onCommentAdd?: (postId: string, text: string) => void;
  onCommentDelete?: (postId: string, commentId: string) => void;
}

const roleIcons = {
  admin: Shield,
  trainer: Crown,
  member: UserIcon,
};

const roleColors = {
  admin: 'text-atelier-darkYellow',
  trainer: 'text-atelier-darkRed',
  member: 'text-atelier-navy',
};

export default function MyPostCard({
  post,
  currentUser,
  onUpdate,
  onDelete,
  onLikeToggle,
  onCommentAdd,
  onCommentDelete,
}: MyPostCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [isLiked, setIsLiked] = useState(
    currentUser ? post.likes.includes(currentUser.gymId) : false
  );

  const RoleIcon = roleIcons[post.authorRole];
  const roleColor = roleColors[post.authorRole];

  const handleDelete = async () => {
    if (!onDelete) return;

    setIsDeleting(true);
    try {
      await onDelete(post._id);
    } catch (error) {
      console.error('Failed to delete post:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleLikeToggle = async () => {
    if (!onLikeToggle || !currentUser) return;

    // Optimistic update
    setIsLiked(!isLiked);
    try {
      await onLikeToggle(post._id);
    } catch (error) {
      // Revert on error
      setIsLiked(!isLiked);
      console.error('Failed to toggle like:', error);
    }
  };

  const handleCommentAdd = async (text: string) => {
    if (!onCommentAdd) return;

    try {
      await onCommentAdd(post._id, text);
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  const handleCommentDelete = async (commentId: string) => {
    if (!onCommentDelete) return;

    try {
      await onCommentDelete(post._id, commentId);
    } catch (error) {
      console.error('Failed to delete comment:', error);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  const getCloudinaryPublicId = (url: string) => {
    if (!url) return '';
    const match = url.match(/\/v\d+\/(.+)$/);
    return match ? match[1] : url;
  };

  const canEdit =
    currentUser &&
    (post.authorId === currentUser.gymId || currentUser.role === 'admin');

  const canDelete =
    currentUser &&
    (post.authorId === currentUser.gymId || currentUser.role === 'admin');

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-atelier-darkYellow to-atelier-darkRed rounded-full flex items-center justify-center">
            <span className="text-black font-bold text-sm">
              {post.authorName.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-white font-semibold">{post.authorName}</h3>
              <RoleIcon className={`w-4 h-4 ${roleColor}`} />
            </div>
            <div className="flex items-center space-x-2 text-gray-400 text-sm">
              <Clock className="w-3 h-3" />
              <span>{formatTimeAgo(post.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Actions Menu */}
        {(canEdit || canDelete) && (
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowActions(!showActions)}
              className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
            >
              <MoreVertical className="w-5 h-5" />
            </motion.button>

            {showActions && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute right-0 top-full mt-2 w-48 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-2 shadow-2xl z-10"
              >
                {canEdit && onUpdate && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setShowActions(false);
                      onUpdate(post);
                    }}
                    className="w-full flex items-center space-x-2 px-3 py-2 text-gray-300 hover:text-atelier-darkYellow hover:bg-white/10 rounded-lg transition-all duration-200"
                  >
                    <Edit className="w-4 h-4" />
                    <span className="text-sm">Edit Post</span>
                  </motion.button>
                )}

                {canDelete && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setShowActions(false);
                      if (
                        confirm('Are you sure you want to delete this post?')
                      ) {
                        handleDelete();
                      }
                    }}
                    disabled={isDeleting}
                    className="w-full flex items-center space-x-2 px-3 py-2 text-gray-300 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200 disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="text-sm">
                      {isDeleting ? 'Deleting...' : 'Delete Post'}
                    </span>
                  </motion.button>
                )}
              </motion.div>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="mb-4">
        <p className="text-white text-lg leading-relaxed mb-3">{post.text}</p>

        {/* Workout Info */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="px-3 py-1 bg-atelier-darkYellow/20 text-atelier-darkYellow rounded-full text-sm font-medium">
            {post.workoutSplit}
          </span>
          {post.musclesWorked.map((muscle, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-white/10 text-white rounded-full text-sm"
            >
              {muscle}
            </span>
          ))}
        </div>

        {/* Media */}
        {post.mediaUrl && (
          <div className="relative mt-4 bg-gray-800 rounded-xl overflow-hidden">
            {post.mediaType === 'video' ? (
              <CldVideoPlayer
                src={post.mediaUrl}
                controls
                className="w-full h-auto rounded-xl"
              />
            ) : (
              <CldImage
                src={getCloudinaryPublicId(post.mediaUrl)}
                width="800"
                height="600"
                alt={`Post by ${post.authorName}`}
                className="w-full h-auto rounded-xl"
                crop="fill"
                gravity="auto"
                quality="auto"
                format="auto"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-white/10">
        <div className="flex items-center space-x-6">
          {/* Like Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleLikeToggle}
            disabled={!currentUser}
            className={`flex items-center space-x-2 transition-all duration-200 ${
              isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
            <span className="text-sm font-medium">{post.likes.length}</span>
          </motion.button>

          {/* Comments Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowComments(!showComments)}
            className="flex items-center space-x-2 text-gray-400 hover:text-atelier-darkYellow transition-all duration-200"
          >
            <MessageCircle className="w-5 h-5" />
            <span className="text-sm font-medium">{post.comments.length}</span>
          </motion.button>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-4 pt-4 border-t border-white/10"
        >
          {/* Comment Composer */}
          {currentUser && (
            <CommentComposer
              onCommentAdd={handleCommentAdd}
              placeholder="Add a comment..."
            />
          )}

          {/* Comments List */}
          <div className="mt-4 space-y-3">
            {post.comments.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-4">
                No comments yet. Be the first to comment!
              </p>
            ) : (
              post.comments
                .sort(
                  (a, b) =>
                    new Date(a.createdAt).getTime() -
                    new Date(b.createdAt).getTime()
                )
                .map(comment => (
                  <div key={comment._id} className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-atelier-darkYellow to-atelier-darkRed rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-black font-bold text-xs">
                        {comment.userName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-white font-medium text-sm">
                          {comment.userName}
                        </span>
                        <span className="text-gray-400 text-xs">
                          {formatTimeAgo(comment.createdAt)}
                        </span>
                      </div>
                      <p className="text-gray-300 text-sm">{comment.text}</p>
                    </div>

                    {/* Delete Comment Button */}
                    {currentUser &&
                      (comment.userId === currentUser.gymId ||
                        currentUser.role === 'admin') && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleCommentDelete(comment._id)}
                          className="text-gray-400 hover:text-red-400 transition-colors duration-200 p-1"
                        >
                          <X className="w-4 h-4" />
                        </motion.button>
                      )}
                  </div>
                ))
            )}
          </div>
        </motion.div>
      )}

      {/* Click outside to close actions menu */}
      {showActions && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowActions(false)}
        />
      )}
    </motion.article>
  );
}

'use client';

import { motion } from 'framer-motion';
import { CldImage, CldVideoPlayer } from 'next-cloudinary';
import { Post, User } from '@/types/community';
import { Trash2, Clock, User as UserIcon, Shield, Crown } from 'lucide-react';
import { useState } from 'react';

interface PostCardProps {
  post: Post;
  currentUser?: User | null;
  onDelete?: (postId: string) => void;
  index: number;
}

const roleIcons = {
  admin: <Crown className="w-4 h-4 text-atelier-darkYellow" />,
  trainer: <Shield className="w-4 h-4 text-atelier-darkRed" />,
  member: <UserIcon className="w-4 h-4 text-atelier-navy" />,
};

const roleColors = {
  admin:
    'bg-atelier-darkYellow/20 text-atelier-darkYellow border-atelier-darkYellow/30',
  trainer:
    'bg-atelier-darkRed/20 text-atelier-darkRed border-atelier-darkRed/30',
  member: 'bg-atelier-navy/20 text-atelier-navy border-atelier-navy/30',
};

export default function PostCard({
  post,
  currentUser,
  onDelete,
  index,
}: PostCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  // Extract public ID from Cloudinary URL
  const getCloudinaryPublicId = (url: string) => {
    if (!url) return '';
    const match = url.match(/\/v\d+\/(.+)$/);
    return match ? match[1] : url;
  };

  // Generate optimized Cloudinary URL with transformations
  const getOptimizedImageUrl = (url: string) => {
    const publicId = getCloudinaryPublicId(url);
    if (!publicId) return url;

    // Use Cloudinary transformations for better performance
    // f_auto: automatic format (WebP/AVIF when supported)
    // q_auto: automatic quality compression
    // w_800,h_600,c_fill: responsive sizing with crop
    return `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/f_auto,q_auto,w_800,h_600,c_fill/${publicId}`;
  };

  const canDelete =
    currentUser &&
    (post.authorId === currentUser.gymId || currentUser.role === 'admin');

  const handleDelete = async () => {
    if (!onDelete || !canDelete) return;

    setIsDeleting(true);
    try {
      await onDelete(post.id);
    } finally {
      setIsDeleting(false);
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
    if (diffInSeconds < 2592000)
      return `${Math.floor(diffInSeconds / 86400)}d ago`;

    return date.toLocaleDateString();
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: 'easeOut',
      }}
      className="glass-card rounded-2xl p-6 space-y-4 hover:shadow-2xl transition-all duration-300"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-atelier-darkYellow to-atelier-darkRed flex items-center justify-center">
            <span className="text-white font-bold text-sm">
              {post.authorName.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-white">{post.authorName}</h3>
              <div
                className={`px-2 py-1 rounded-full text-xs font-medium border flex items-center space-x-1 ${roleColors[post.authorRole]}`}
              >
                {roleIcons[post.authorRole]}
                <span className="capitalize">{post.authorRole}</span>
              </div>
            </div>
            <div className="flex items-center space-x-1 text-gray-400 text-sm">
              <Clock className="w-3 h-3" />
              <span>{formatTimeAgo(post.createdAt)}</span>
            </div>
          </div>
        </div>

        {canDelete && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-2 rounded-full hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors disabled:opacity-50"
            aria-label="Delete post"
          >
            <Trash2 className="w-4 h-4" />
          </motion.button>
        )}
      </div>

      {/* Workout Info */}
      <div className="flex flex-wrap gap-2">
        <span className="px-3 py-1 bg-atelier-navy/30 text-atelier-accentWhite rounded-full text-sm font-medium">
          {post.workoutSplit}
        </span>
        {post.musclesWorked.map((muscle, idx) => (
          <span
            key={idx}
            className="px-2 py-1 bg-atelier-darkRed/20 text-atelier-darkRed rounded-full text-xs"
          >
            {muscle}
          </span>
        ))}
      </div>

      {/* Post Text */}
      <p className="text-gray-200 leading-relaxed whitespace-pre-wrap">
        {post.text}
      </p>

      {/* Media */}
      {post.mediaUrl && (
        <div className="relative rounded-xl overflow-hidden">
          {post.mediaType === 'video' ? (
            <CldVideoPlayer
              width="100%"
              height="auto"
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
    </motion.article>
  );
}

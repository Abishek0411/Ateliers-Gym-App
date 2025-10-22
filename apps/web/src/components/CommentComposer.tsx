'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Loader2 } from 'lucide-react';

interface CommentComposerProps {
  onCommentAdd: (text: string) => Promise<void>;
  placeholder?: string;
  className?: string;
}

export default function CommentComposer({
  onCommentAdd,
  placeholder = 'Write a comment...',
  className = '',
}: CommentComposerProps) {
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!text.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onCommentAdd(text.trim());
      setText('');
    } catch (error) {
      console.error('Failed to add comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSubmit(e);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className={`flex items-end space-x-3 ${className}`}
    >
      <div className="flex-1">
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={isSubmitting}
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-atelier-darkYellow focus:border-transparent resize-none disabled:opacity-50 disabled:cursor-not-allowed"
          rows={2}
          maxLength={500}
        />
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs text-gray-400">
            {text.length}/500 characters
          </span>
          <span className="text-xs text-gray-400">
            Press Cmd+Enter to submit
          </span>
        </div>
      </div>

      <motion.button
        type="submit"
        disabled={!text.trim() || isSubmitting}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="p-3 bg-gradient-to-r from-atelier-darkYellow to-atelier-darkRed text-black rounded-xl hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {isSubmitting ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <Send className="w-5 h-5" />
        )}
      </motion.button>
    </motion.form>
  );
}

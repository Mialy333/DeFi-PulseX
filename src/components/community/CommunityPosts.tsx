import React, { useState } from 'react';
import { ThumbsUp, MessageCircle, Share2, Award } from 'lucide-react';

interface Post {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  hasLiked: boolean;
  xpReward: number;
  tags: string[];
}

const CommunityPosts: React.FC = () => {
  // Mock data - replace with real data from your backend
  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      author: '0x742d...8c8c',
      content: 'Just completed a successful arbitrage trade between Uniswap and PulseX! Check out my strategy in the comments. 🚀',
      timestamp: '2 hours ago',
      likes: 124,
      comments: 18,
      hasLiked: false,
      xpReward: 50,
      tags: ['arbitrage', 'strategy', 'defi']
    },
    // Add more mock posts...
  ]);

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          likes: post.hasLiked ? post.likes - 1 : post.likes + 1,
          hasLiked: !post.hasLiked
        };
      }
      return post;
    }));
  };

  return (
    <div className="space-y-6">
      {/* Create Post Box */}
      <div className="bg-deep-purple-700/30 border border-deep-purple-500/30 rounded-xl p-6 backdrop-blur-sm">
        <textarea
          placeholder="Share your trading insights..."
          className="w-full bg-deep-purple-800/30 border border-deep-purple-500/20 rounded-lg p-4 text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-400/50 resize-none"
          rows={3}
        />
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Award className="w-4 h-4 text-green-400" />
            <span>Earn 50 XP for quality posts</span>
          </div>
          <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
            Post
          </button>
        </div>
      </div>

      {/* Posts List */}
      {posts.map(post => (
        <div key={post.id} className="bg-deep-purple-700/30 border border-deep-purple-500/30 rounded-xl p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-slate-200 font-medium">{post.author}</div>
              <div className="text-sm text-slate-400">{post.timestamp}</div>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 rounded-full">
              <Award className="w-4 h-4 text-green-400" />
              <span className="text-sm text-green-400">+{post.xpReward} XP</span>
            </div>
          </div>

          <p className="text-slate-200 mb-4">{post.content}</p>

          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map(tag => (
              <span
                key={tag}
                className="px-3 py-1 bg-deep-purple-800/30 text-slate-400 rounded-full text-sm"
              >
                #{tag}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-6 pt-4 border-t border-deep-purple-500/20">
            <button
              onClick={() => handleLike(post.id)}
              className={`flex items-center gap-2 ${
                post.hasLiked ? 'text-green-400' : 'text-slate-400'
              } hover:text-green-400 transition-colors`}
            >
              <ThumbsUp className="w-4 h-4" />
              <span>{post.likes}</span>
            </button>
            <button className="flex items-center gap-2 text-slate-400 hover:text-slate-300 transition-colors">
              <MessageCircle className="w-4 h-4" />
              <span>{post.comments}</span>
            </button>
            <button className="flex items-center gap-2 text-slate-400 hover:text-slate-300 transition-colors">
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommunityPosts;

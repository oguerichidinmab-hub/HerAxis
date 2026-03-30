import React, { useState } from 'react';
import { FORUM_POSTS } from '../mockData';
import { MessageSquare, Heart, Share2, Plus, Search, X, Send, ShieldCheck, Info, Smile, Users, HeartHandshake } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ForumPost } from '../types';
import { useUser } from '../UserContext';

export const CommunityScreen: React.FC = () => {
  const { profile } = useUser();
  const [activeCategory, setActiveCategory] = useState('All');
  const [posts, setPosts] = useState<ForumPost[]>(FORUM_POSTS);
  const [selectedPost, setSelectedPost] = useState<ForumPost | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostCategory, setNewPostCategory] = useState('Pregnancy questions');
  const [newComment, setNewComment] = useState('');
  const [showGuidelines, setShowGuidelines] = useState(false);

  const categories = [
    'All', 
    'Pregnancy questions', 
    'New mom support', 
    'Breastfeeding', 
    'Emotional well-being', 
    'Baby care', 
    'Recovery after childbirth'
  ];

  const filteredPosts = activeCategory === 'All' 
    ? posts 
    : posts.filter(p => p.category === activeCategory);

  const handleCreatePost = () => {
    if (!newPostContent.trim()) return;
    
    const newPost: ForumPost = {
      id: Date.now().toString(),
      author: profile.name || 'Anonymous',
      content: newPostContent,
      timestamp: 'Just now',
      likes: 0,
      comments: [],
      category: newPostCategory as any
    };

    setPosts([newPost, ...posts]);
    setNewPostContent('');
    setShowCreateModal(false);
  };

  const handleAddComment = (postId: string) => {
    if (!newComment.trim()) return;

    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        const comment = {
          id: Date.now().toString(),
          author: profile.name || 'Anonymous',
          content: newComment,
          timestamp: 'Just now'
        };
        return {
          ...post,
          comments: [...post.comments, comment]
        };
      }
      return post;
    });

    setPosts(updatedPosts);
    
    // Update selected post if it's open
    if (selectedPost?.id === postId) {
      setSelectedPost(updatedPosts.find(p => p.id === postId) || null);
    }
    
    setNewComment('');
  };

  const handleLikePost = (postId: string) => {
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        return { ...post, likes: post.likes + 1 };
      }
      return post;
    });
    setPosts(updatedPosts);
    if (selectedPost?.id === postId) {
      setSelectedPost(updatedPosts.find(p => p.id === postId) || null);
    }
  };

  return (
    <div className="space-y-6 pb-24">
      <header className="pt-8 px-4">
        <h1 className="text-3xl font-bold text-stone-900">Community Space</h1>
        <p className="text-stone-500">A safe, supportive place for mothers</p>
      </header>

      {/* Welcome Note and Guidelines */}
      <section className="px-4">
        <div className="bg-pink-50 rounded-[2rem] p-6 border border-pink-100 relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-pink-200/30 rounded-full blur-2xl" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-pink-500 p-2 rounded-xl text-white">
                <HeartHandshake size={20} />
              </div>
              <h2 className="text-lg font-bold text-pink-900">Welcome, Mama</h2>
            </div>
            <p className="text-pink-800 text-sm leading-relaxed mb-4">
              This is your safe space to share experiences, ask questions, and support one another. We are all in this together.
            </p>
            <button 
              onClick={() => setShowGuidelines(!showGuidelines)}
              className="text-pink-600 text-xs font-bold flex items-center gap-1 hover:text-pink-700 transition-colors"
            >
              <ShieldCheck size={14} /> View Community Guidelines
            </button>
            
            <AnimatePresence>
              {showGuidelines && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="pt-4 mt-4 border-t border-pink-200/50 grid grid-cols-1 gap-3">
                    {[
                      { icon: Smile, text: 'Be kind and respectful' },
                      { icon: ShieldCheck, text: 'No bullying or judgment' },
                      { icon: Users, text: 'Respect privacy' },
                      { icon: Info, text: 'Support, do not shame' }
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-pink-700">
                        <item.icon size={14} className="text-pink-400" />
                        {item.text}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Search and Categories */}
      <section className="px-4 space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
          <input
            type="text"
            placeholder="Search discussions..."
            className="w-full bg-white border border-stone-100 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-pink-500/20"
          />
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${
                activeCategory === cat 
                  ? 'bg-pink-600 text-white shadow-md shadow-pink-100' 
                  : 'bg-white text-stone-500 border border-stone-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Posts List */}
      <section className="px-4 space-y-4">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => setSelectedPost(post)}
              className="bg-white p-5 rounded-[2rem] border border-stone-100 shadow-sm cursor-pointer hover:border-pink-200 transition-colors group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 font-bold">
                    {post.author[0]}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-stone-900">{post.author}</p>
                    <p className="text-xs text-stone-400">{post.timestamp}</p>
                  </div>
                </div>
                <span className="bg-stone-50 text-stone-500 text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">
                  {post.category}
                </span>
              </div>
              
              <p className="text-stone-700 text-sm leading-relaxed mb-4 line-clamp-3">
                {post.content}
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-stone-50">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLikePost(post.id);
                    }}
                    className="flex items-center gap-1.5 text-stone-400 text-xs hover:text-pink-500 transition-colors group-hover:text-stone-600"
                  >
                    <Heart size={16} className={post.likes > 0 ? "fill-pink-500 text-pink-500" : ""} /> 
                    <span className="font-medium">{post.likes > 0 ? 'Support' : 'Support'} {post.likes > 0 && post.likes}</span>
                  </button>
                  <div className="flex items-center gap-1.5 text-stone-400 text-xs">
                    <MessageSquare size={16} /> {post.comments.length}
                  </div>
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="text-stone-400 hover:text-pink-500 transition-colors"
                >
                  <Share2 size={16} />
                </button>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="py-12 text-center space-y-4">
            <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center mx-auto text-stone-300">
              <MessageSquare size={32} />
            </div>
            <div>
              <p className="text-stone-900 font-bold">No discussions yet</p>
              <p className="text-stone-500 text-sm">Be the first to share your experience or ask a question.</p>
            </div>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="bg-pink-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-pink-700 transition-colors"
            >
              Start a Discussion
            </button>
          </div>
        )}
      </section>

      {/* Floating Action Button */}
      <button 
        onClick={() => setShowCreateModal(true)}
        className="fixed bottom-24 right-6 w-14 h-14 bg-pink-600 text-white rounded-full shadow-xl flex items-center justify-center hover:bg-pink-700 transition-colors z-30"
      >
        <Plus size={28} />
      </button>

      {/* Post Detail Modal */}
      <AnimatePresence>
        {selectedPost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPost(null)}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full max-w-2xl rounded-t-[2.5rem] sm:rounded-[2.5rem] p-6 sm:p-8 shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]"
            >
              <button 
                onClick={() => setSelectedPost(null)} 
                className="absolute top-6 right-6 p-2 hover:bg-stone-100 rounded-full transition-colors"
              >
                <X size={24} className="text-stone-400" />
              </button>

              <div className="overflow-y-auto pr-2 scrollbar-hide">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 font-bold text-lg">
                    {selectedPost.author[0]}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-stone-900">{selectedPost.author}</p>
                    <p className="text-xs text-stone-400">{selectedPost.timestamp}</p>
                  </div>
                  <button 
                    onClick={() => handleLikePost(selectedPost.id)}
                    className="flex items-center gap-1.5 bg-pink-50 text-pink-600 px-3 py-1.5 rounded-full text-xs font-bold hover:bg-pink-100 transition-colors"
                  >
                    <Heart size={14} className={selectedPost.likes > 0 ? "fill-pink-500" : ""} /> {selectedPost.likes}
                  </button>
                </div>

                <p className="text-stone-700 leading-relaxed mb-8 text-lg">
                  {selectedPost.content}
                </p>

                <div className="border-t border-stone-100 pt-6 space-y-6">
                  <h4 className="font-bold text-stone-800 flex items-center gap-2">
                    <MessageSquare size={18} className="text-pink-500" />
                    Comments ({selectedPost.comments.length})
                  </h4>

                  <div className="space-y-4">
                    {selectedPost.comments.map((comment) => (
                      <div key={comment.id} className="bg-stone-50 p-4 rounded-2xl border border-stone-100">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-bold text-sm text-stone-900">{comment.author}</span>
                          <span className="text-[10px] text-stone-400 uppercase tracking-wider">{comment.timestamp}</span>
                        </div>
                        <p className="text-sm text-stone-600 leading-relaxed">{comment.content}</p>
                      </div>
                    ))}
                    {selectedPost.comments.length === 0 && (
                      <p className="text-center text-stone-400 text-sm py-4">No comments yet. Be the first to reply!</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-stone-100 flex gap-3">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write a reply..."
                  className="flex-1 bg-stone-50 border border-stone-100 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-pink-300 transition-colors"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddComment(selectedPost.id)}
                />
                <button
                  onClick={() => handleAddComment(selectedPost.id)}
                  className="bg-pink-600 text-white p-3 rounded-2xl hover:bg-pink-700 transition-colors shadow-lg shadow-pink-100"
                >
                  <Send size={20} />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Post Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowCreateModal(false)}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl relative"
            >
              <button 
                onClick={() => setShowCreateModal(false)} 
                className="absolute top-6 right-6 p-2 hover:bg-stone-100 rounded-full transition-colors"
              >
                <X size={24} className="text-stone-400" />
              </button>

              <h2 className="text-2xl font-bold text-stone-900 mb-6">Start a Discussion</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider mb-2 px-1">Category</label>
                  <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                    {categories.filter(c => c !== 'All').map(cat => (
                      <button
                        key={cat}
                        onClick={() => setNewPostCategory(cat)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                          newPostCategory === cat 
                            ? 'bg-pink-600 text-white shadow-md shadow-pink-100' 
                            : 'bg-stone-50 text-stone-500 border border-stone-100'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider mb-2 px-1">Your Message</label>
                  <textarea
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    placeholder="Share your experience, ask a question, or offer support..."
                    rows={5}
                    className="w-full bg-stone-50 border border-stone-100 rounded-2xl p-4 text-sm focus:outline-none focus:border-pink-300 transition-colors resize-none"
                  />
                </div>

                <button
                  onClick={handleCreatePost}
                  disabled={!newPostContent.trim()}
                  className="w-full bg-pink-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-pink-100 hover:bg-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Post to Community
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

import React, { useState } from 'react';
import { FORUM_POSTS } from '../mockData';
import { MessageSquare, Heart, Share2, Plus, Search } from 'lucide-react';
import { motion } from 'motion/react';

export const CommunityScreen: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const categories = ['All', 'Pregnancy', 'Baby', 'Postpartum', 'General'];

  const filteredPosts = activeCategory === 'All' 
    ? FORUM_POSTS 
    : FORUM_POSTS.filter(p => p.category === activeCategory);

  return (
    <div className="space-y-6 pb-24">
      <header className="pt-8 px-4">
        <h1 className="text-3xl font-bold text-stone-900">Community</h1>
        <p className="text-stone-500">A safe space for support</p>
      </header>

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
        {filteredPosts.map((post, i) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-5 rounded-[2rem] border border-stone-100 shadow-sm"
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
            
            <p className="text-stone-700 text-sm leading-relaxed mb-4">
              {post.content}
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-stone-50">
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-1.5 text-stone-400 text-xs hover:text-pink-500 transition-colors">
                  <Heart size={16} /> {post.likes}
                </button>
                <button className="flex items-center gap-1.5 text-stone-400 text-xs hover:text-pink-500 transition-colors">
                  <MessageSquare size={16} /> {post.comments}
                </button>
              </div>
              <button className="text-stone-400 hover:text-pink-500 transition-colors">
                <Share2 size={16} />
              </button>
            </div>
          </motion.div>
        ))}
      </section>

      {/* Floating Action Button */}
      <button className="fixed bottom-24 right-6 w-14 h-14 bg-pink-600 text-white rounded-full shadow-xl flex items-center justify-center hover:bg-pink-700 transition-colors z-30">
        <Plus size={28} />
      </button>
    </div>
  );
};

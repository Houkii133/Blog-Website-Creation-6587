import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import supabase from '../lib/supabase';

const { FiClock, FiTrendingUp, FiBot, FiFilter, FiSearch } = FiIcons;

const AIBlogGrid = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('published');

  const categories = ['all', 'technology', 'ai', 'business', 'art', 'animals', 'education', 'science'];

  useEffect(() => {
    fetchPosts();
  }, [selectedCategory, sortBy]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('ai_generated_posts_ai2024')
        .select('*')
        .eq('status', 'published');

      if (selectedCategory !== 'all') {
        query = query.eq('category', selectedCategory);
      }

      if (sortBy === 'trending') {
        query = query.order('seo_score', { ascending: false });
      } else {
        query = query.order('published', { ascending: false });
      }

      const { data, error } = await query.limit(12);

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.meta_description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <SafeIcon icon={FiBot} className="h-8 w-8 text-primary-600" />
            <h2 className="text-3xl font-bold text-gray-900">AI-Generated Articles</h2>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover the latest insights powered by artificial intelligence. 
            Fresh content updated automatically from trending topics across the web.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-col lg:flex-row gap-4 items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center space-x-4">
            {/* Category Filter */}
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiFilter} className="h-5 w-5 text-gray-500" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="published">Latest</option>
              <option value="trending">Trending</option>
            </select>
          </div>
        </div>

        {/* Posts Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredPosts.map((post) => (
            <motion.article
              key={post.id}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100"
            >
              {/* AI Badge */}
              <div className="relative">
                <div className="bg-gradient-to-r from-primary-500 to-blue-500 p-4">
                  <div className="flex items-center justify-between">
                    <span className="bg-white/20 text-white px-2 py-1 rounded-full text-xs font-medium capitalize">
                      {post.category}
                    </span>
                    <div className="flex items-center space-x-1 bg-white/20 text-white px-2 py-1 rounded-full text-xs">
                      <SafeIcon icon={FiBot} className="h-3 w-3" />
                      <span>AI</span>
                    </div>
                  </div>
                </div>
                
                {post.seo_score > 80 && (
                  <div className="absolute top-2 right-2">
                    <div className="flex items-center space-x-1 bg-green-500 text-white px-2 py-1 rounded-full text-xs">
                      <SafeIcon icon={FiTrendingUp} className="h-3 w-3" />
                      <span>Hot</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 leading-tight">
                  {post.title}
                </h3>
                
                <p className="text-gray-600 mb-4 line-clamp-3 text-sm leading-relaxed">
                  {post.meta_description}
                </p>

                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1">
                      <SafeIcon icon={FiClock} className="h-3 w-3" />
                      <span>{post.reading_time}</span>
                    </div>
                    <span>{format(new Date(post.published), 'MMM dd')}</span>
                  </div>
                  <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">
                    SEO: {post.seo_score}%
                  </div>
                </div>

                <Link
                  to={`/ai-post/${post.slug}`}
                  className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-medium text-sm group"
                >
                  <span>Read Full Article</span>
                  <SafeIcon 
                    icon={FiTrendingUp} 
                    className="h-4 w-4 group-hover:translate-x-1 transition-transform" 
                  />
                </Link>

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-1">
                    {post.tags.slice(0, 3).map((tag, index) => (
                      <span 
                        key={index}
                        className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.article>
          ))}
        </motion.div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <SafeIcon icon={FiBot} className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No articles found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        )}

        {/* Load More */}
        {filteredPosts.length >= 12 && (
          <div className="text-center mt-12">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-primary-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors"
              onClick={fetchPosts}
            >
              Load More Articles
            </motion.button>
          </div>
        )}
      </div>
    </section>
  );
};

export default AIBlogGrid;
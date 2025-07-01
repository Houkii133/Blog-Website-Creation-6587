import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import SEOHead from '../components/SEOHead';
import { HeaderAd, InArticleAd, SidebarAd, FooterAd } from '../components/AdSense';
import supabase from '../lib/supabase';

const { FiArrowLeft, FiClock, FiUser, FiCalendar, FiHeart, FiShare2, FiBookmark, FiTrendingUp, FiExternalLink } = FiIcons;

const AIBlogPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPost();
  }, [slug]);

  const fetchPost = async () => {
    try {
      const { data: postData, error } = await supabase
        .from('ai_generated_posts_ai2024')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

      if (error) throw error;

      setPost(postData);

      // Fetch related posts
      const { data: relatedData } = await supabase
        .from('ai_generated_posts_ai2024')
        .select('title, slug, category, published, reading_time')
        .eq('category', postData.category)
        .neq('slug', slug)
        .eq('status', 'published')
        .order('published', { ascending: false })
        .limit(3);

      setRelatedPosts(relatedData || []);
    } catch (error) {
      console.error('Error fetching post:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatContent = (content) => {
    return content
      .replace(/## (.*)/g, '<h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">$1</h2>')
      .replace(/### (.*)/g, '<h3 class="text-xl font-semibold text-gray-900 mt-6 mb-3">$1</h3>')
      .replace(/\n\n/g, '</p><p class="mb-4">')
      .replace(/^\s*/, '<p class="mb-4">')
      .replace(/\s*$/, '</p>');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Post Not Found</h1>
          <Link to="/" className="text-primary-600 hover:text-primary-700">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEOHead
        title={post.title}
        description={post.meta_description}
        keywords={post.tags}
        url={`/ai-post/${post.slug}`}
        publishedTime={post.published}
        category={post.category}
        type="article"
      />

      <motion.article
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-white"
      >
        {/* Header Ad */}
        <HeaderAd />

        {/* Header */}
        <div className="bg-gradient-to-r from-primary-50 to-blue-50 py-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              to="/"
              className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700 mb-6"
            >
              <SafeIcon icon={FiArrowLeft} className="h-4 w-4" />
              <span>Back to Blog</span>
            </Link>

            <div className="flex flex-wrap items-center gap-4 mb-6">
              <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium capitalize">
                {post.category}
              </span>
              <div className="flex items-center space-x-2 text-green-600">
                <SafeIcon icon={FiTrendingUp} className="h-4 w-4" />
                <span className="text-sm font-medium">Trending Topic</span>
              </div>
              <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-medium">
                SEO Score: {post.seo_score}%
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-8">
              <div className="flex items-center space-x-2">
                <SafeIcon icon={FiUser} className="h-4 w-4" />
                <span>BlogSpace AI</span>
              </div>
              <div className="flex items-center space-x-2">
                <SafeIcon icon={FiCalendar} className="h-4 w-4" />
                <span>{format(new Date(post.published), 'MMM dd, yyyy')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <SafeIcon icon={FiClock} className="h-4 w-4" />
                <span>{post.reading_time}</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors"
              >
                <SafeIcon icon={FiHeart} className="h-4 w-4" />
                <span>Like</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <SafeIcon icon={FiShare2} className="h-4 w-4" />
                <span>Share</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 bg-yellow-50 text-yellow-600 px-4 py-2 rounded-lg hover:bg-yellow-100 transition-colors"
              >
                <SafeIcon icon={FiBookmark} className="h-4 w-4" />
                <span>Save</span>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Content Container */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="prose prose-lg max-w-none">
                <div 
                  className="text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: formatContent(post.content) }} 
                />
              </div>

              {/* In-Article Ad */}
              <InArticleAd />

              {/* Source Articles */}
              {post.source_articles && post.source_articles.length > 0 && (
                <div className="mt-12 p-6 bg-gray-50 rounded-xl">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Sources & References</h3>
                  <div className="space-y-3">
                    {post.source_articles.map((source, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <SafeIcon icon={FiExternalLink} className="h-4 w-4 text-gray-400 mt-1 flex-shrink-0" />
                        <div>
                          <a 
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary-600 hover:text-primary-700 font-medium"
                          >
                            {source.title}
                          </a>
                          <p className="text-sm text-gray-500">{source.source}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="mt-8 flex flex-wrap gap-2">
                  {post.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="space-y-6">
                {/* Sidebar Ad */}
                <SidebarAd />

                {/* Related Posts */}
                {relatedPosts.length > 0 && (
                  <div className="bg-white p-6 rounded-xl shadow-lg">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Related Articles</h3>
                    <div className="space-y-4">
                      {relatedPosts.map((relatedPost, index) => (
                        <Link
                          key={index}
                          to={`/ai-post/${relatedPost.slug}`}
                          className="block p-3 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <h4 className="font-medium text-gray-900 mb-2 line-clamp-2">
                            {relatedPost.title}
                          </h4>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span className="capitalize">{relatedPost.category}</span>
                            <span>{relatedPost.reading_time}</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Newsletter Signup */}
                <div className="bg-primary-50 p-6 rounded-xl">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Stay Updated</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Get the latest AI-generated insights delivered to your inbox.
                  </p>
                  <div className="space-y-3">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <button className="w-full bg-primary-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors">
                      Subscribe
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Ad */}
        <FooterAd />
      </motion.article>
    </>
  );
};

export default AIBlogPost;
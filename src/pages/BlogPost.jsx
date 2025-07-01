import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiArrowLeft, FiClock, FiUser, FiCalendar, FiHeart, FiShare2, FiBookmark } = FiIcons;

const BlogPost = () => {
  const { id } = useParams();

  // Mock blog post data
  const post = {
    id: 1,
    title: "The Future of Web Development: Trends to Watch in 2024",
    author: "Sarah Johnson",
    date: "Dec 15, 2023",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&q=80",
    category: "Technology",
    content: `
      <p>The web development landscape is constantly evolving, and 2024 promises to bring exciting new trends and technologies that will reshape how we build digital experiences.</p>
      
      <h2>AI-Powered Development Tools</h2>
      <p>Artificial Intelligence is revolutionizing the way we write code. From intelligent code completion to automated testing, AI tools are becoming indispensable for modern developers.</p>
      
      <h2>Progressive Web Apps (PWAs)</h2>
      <p>PWAs continue to gain traction as they offer native app-like experiences through web browsers. With improved offline capabilities and performance, they're becoming the go-to solution for businesses looking to reach users across all platforms.</p>
      
      <h2>WebAssembly (WASM)</h2>
      <p>WebAssembly is opening new possibilities for web applications by allowing developers to run high-performance code written in languages like C++, Rust, and Go directly in the browser.</p>
      
      <h2>Micro-Frontends Architecture</h2>
      <p>As applications grow in complexity, micro-frontends are emerging as a solution to break down monolithic frontend applications into smaller, manageable pieces that can be developed and deployed independently.</p>
      
      <h2>Conclusion</h2>
      <p>The future of web development is bright, with new technologies and methodologies emerging to help us build better, faster, and more accessible web experiences. Staying current with these trends will be crucial for developers looking to remain competitive in the ever-evolving tech landscape.</p>
    `
  };

  return (
    <motion.article
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="bg-white"
    >
      {/* Header */}
      <div className="bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700 mb-6"
          >
            <SafeIcon icon={FiArrowLeft} className="h-4 w-4" />
            <span>Back to Blog</span>
          </Link>

          <div className="mb-6">
            <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium">
              {post.category}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-8">
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiUser} className="h-4 w-4" />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiCalendar} className="h-4 w-4" />
              <span>{post.date}</span>
            </div>
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiClock} className="h-4 w-4" />
              <span>{post.readTime}</span>
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

      {/* Featured Image */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="aspect-w-16 aspect-h-9 rounded-xl overflow-hidden">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-96 object-cover"
          />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="prose prose-lg max-w-none">
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>

        {/* Author Bio */}
        <div className="mt-12 p-6 bg-gray-50 rounded-xl">
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">SJ</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">{post.author}</h3>
              <p className="text-gray-600 mt-2">
                Sarah is a senior web developer with over 8 years of experience in building 
                scalable web applications. She's passionate about emerging technologies and 
                loves sharing her knowledge with the developer community.
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
};

export default BlogPost;
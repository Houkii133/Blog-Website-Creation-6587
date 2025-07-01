import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiClock, FiUser, FiArrowRight } = FiIcons;

const BlogGrid = () => {
  const posts = [
    {
      id: 1,
      title: "The Future of Web Development: Trends to Watch in 2024",
      excerpt: "Explore the latest trends shaping the web development landscape, from AI integration to progressive web apps.",
      author: "Sarah Johnson",
      date: "Dec 15, 2023",
      readTime: "5 min read",
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80",
      category: "Technology"
    },
    {
      id: 2,
      title: "Building Sustainable Design Systems",
      excerpt: "Learn how to create design systems that scale with your organization and stand the test of time.",
      author: "Michael Chen",
      date: "Dec 12, 2023",
      readTime: "8 min read",
      image: "https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&q=80",
      category: "Design"
    },
    {
      id: 3,
      title: "The Art of Minimalist Photography",
      excerpt: "Discover techniques for creating powerful images with simple compositions and clean aesthetics.",
      author: "Emma Davis",
      date: "Dec 10, 2023",
      readTime: "6 min read",
      image: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800&q=80",
      category: "Photography"
    },
    {
      id: 4,
      title: "Remote Work Culture: Building Connection in Digital Teams",
      excerpt: "Strategies for maintaining team cohesion and culture in distributed work environments.",
      author: "David Wilson",
      date: "Dec 8, 2023",
      readTime: "7 min read",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80",
      category: "Business"
    },
    {
      id: 5,
      title: "Sustainable Living: Small Changes, Big Impact",
      excerpt: "Simple lifestyle adjustments that can make a significant difference for our planet.",
      author: "Lisa Thompson",
      date: "Dec 5, 2023",
      readTime: "4 min read",
      image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80",
      category: "Lifestyle"
    },
    {
      id: 6,
      title: "The Psychology of Color in Digital Design",
      excerpt: "Understanding how color choices influence user behavior and emotional responses.",
      author: "Alex Rodriguez",
      date: "Dec 3, 2023",
      readTime: "9 min read",
      image: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&q=80",
      category: "Design"
    }
  ];

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

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Latest Articles</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Dive into our curated collection of articles covering technology, design, business, and lifestyle.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {posts.map((post) => (
            <motion.article
              key={post.id}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="aspect-w-16 aspect-h-9 relative overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                    {post.category}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-2">
                    <SafeIcon icon={FiUser} className="h-4 w-4" />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <SafeIcon icon={FiClock} className="h-4 w-4" />
                      <span>{post.readTime}</span>
                    </div>
                    <span>{post.date}</span>
                  </div>
                </div>

                <Link
                  to={`/post/${post.id}`}
                  className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-medium group"
                >
                  <span>Read More</span>
                  <SafeIcon 
                    icon={FiArrowRight} 
                    className="h-4 w-4 group-hover:translate-x-1 transition-transform" 
                  />
                </Link>
              </div>
            </motion.article>
          ))}
        </motion.div>

        <div className="text-center mt-12">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gray-100 text-gray-700 px-8 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            Load More Articles
          </motion.button>
        </div>
      </div>
    </section>
  );
};

export default BlogGrid;
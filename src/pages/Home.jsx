import React from 'react';
import { motion } from 'framer-motion';
import Hero from '../components/Hero';
import BlogGrid from '../components/BlogGrid';
import Newsletter from '../components/Newsletter';

const Home = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <Hero />
      <BlogGrid />
      <Newsletter />
    </motion.div>
  );
};

export default Home;
import React from 'react';
import { motion } from 'framer-motion';
import { HeaderAd, FooterAd } from '../components/AdSense';
import Hero from '../components/Hero';
import AIBlogGrid from '../components/AIBlogGrid';
import Newsletter from '../components/Newsletter';
import SEOHead from '../components/SEOHead';
import SecurityWarning from '../components/SecurityWarning';

const AIHome = () => {
  return (
    <>
      <SEOHead 
        title="BlogSpace AI - Autonomous Technology Blog"
        description="Discover the latest in technology, AI, business, and more. Our autonomous AI scans trending topics and creates fresh, SEO-optimized content daily."
        keywords={['AI blog', 'technology news', 'artificial intelligence', 'autonomous content', 'trending topics', 'tech insights']}
        url="/"
      />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <HeaderAd />
        <SecurityWarning />
        <Hero />
        <AIBlogGrid />
        <Newsletter />
        <FooterAd />
      </motion.div>
    </>
  );
};

export default AIHome;
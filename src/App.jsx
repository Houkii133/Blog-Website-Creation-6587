import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { QuestProvider } from '@questlabs/react-sdk';
import '@questlabs/react-sdk/dist/style.css';

import Header from './components/Header';
import AIHome from './pages/AIHome';
import AIBlogPost from './pages/AIBlogPost';
import About from './pages/About';
import Contact from './pages/Contact';
import AdminPanel from './components/AdminPanel';
import AppHelp from './components/HelpHub';
import questConfig from './config/questConfig';
import './App.css';

function App() {
  return (
    <QuestProvider 
      apiKey={questConfig.APIKEY}
      entityId={questConfig.ENTITYID}
      apiType="PRODUCTION"
    >
      <HelmetProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            {/* Google AdSense Script */}
            <script 
              async 
              src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-your-adsense-id" 
              crossOrigin="anonymous"
            ></script>
            
            <Header />
            
            <motion.main
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Routes>
                <Route path="/" element={<AIHome />} />
                <Route path="/ai-post/:slug" element={<AIBlogPost />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/admin" element={<AdminPanel />} />
              </Routes>
            </motion.main>

            {/* Help Hub Component with higher z-index */}
            <AppHelp />
          </div>
        </Router>
      </HelmetProvider>
    </QuestProvider>
  );
}

export default App;
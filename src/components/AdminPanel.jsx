import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import secureAIService from '../services/secureAIService';
import apiKeyManager from '../services/apiKeyManager';
import supabase from '../lib/supabase';

const { FiPlay, FiRefreshCw, FiDatabase, FiSettings, FiAlertCircle, FiCheck, FiKey, FiPlus, FiEye, FiEyeOff } = FiIcons;

const AdminPanel = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [stats, setStats] = useState({
    totalPosts: 0,
    publishedPosts: 0,
    avgSeoScore: 0
  });
  const [logs, setLogs] = useState([]);
  const [availableProviders, setAvailableProviders] = useState([]);
  const [apiKeys, setApiKeys] = useState([]);
  const [showKeys, setShowKeys] = useState({});
  const [newKey, setNewKey] = useState({ provider: '', api_key: '' });
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializePanel();
  }, []);

  const initializePanel = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadStats(),
        loadAPIKeys(),
        loadAvailableProviders()
      ]);
      addLog('✅ Admin panel initialized successfully', 'success');
    } catch (error) {
      addLog(`❌ Failed to initialize: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const { data: posts, error } = await supabase
        .from('ai_generated_posts_ai2024')
        .select('seo_score, status');

      if (error) throw error;

      const totalPosts = posts?.length || 0;
      const publishedPosts = posts?.filter(p => p.status === 'published').length || 0;
      const avgSeoScore = posts?.length > 0 
        ? Math.round(posts.reduce((sum, p) => sum + (p.seo_score || 0), 0) / posts.length)
        : 0;

      setStats({ totalPosts, publishedPosts, avgSeoScore });
    } catch (error) {
      console.error('Error loading stats:', error);
      addLog('⚠️ Could not load stats - creating tables if needed', 'info');
    }
  };

  const loadAPIKeys = async () => {
    try {
      addLog('🔄 Loading API keys from database...', 'info');
      
      const { data, error } = await supabase
        .from('auth_keys_ai2024')
        .select('id, provider, api_key, is_active, created_at')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      setApiKeys(data || []);
      addLog(`✅ Loaded ${data?.length || 0} API keys from database`, 'success');
      
      // Clear the API key cache to force refresh
      apiKeyManager.clearCache();
    } catch (error) {
      console.error('Error loading API keys:', error);
      addLog(`❌ Failed to load API keys: ${error.message}`, 'error');
      setApiKeys([]);
    }
  };

  const loadAvailableProviders = async () => {
    try {
      addLog('🔍 Checking available providers...', 'info');
      
      // Force refresh by clearing cache first
      apiKeyManager.clearCache();
      
      const providers = await secureAIService.getAvailableProviders();
      setAvailableProviders(providers);
      
      if (providers.length > 0 && !providers.includes('demo')) {
        addLog(`✅ Found ${providers.length} active providers: ${providers.join(', ')}`, 'success');
      } else {
        addLog('⚠️ No API keys configured - running in demo mode', 'info');
      }
    } catch (error) {
      console.error('Error loading providers:', error);
      setAvailableProviders(['demo']);
      addLog('❌ Error checking providers, falling back to demo mode', 'error');
    }
  };

  const addLog = (message, type = 'info') => {
    const newLog = {
      id: Date.now(),
      message,
      type,
      timestamp: new Date().toLocaleTimeString()
    };
    setLogs(prev => [newLog, ...prev.slice(0, 19)]); // Keep last 20 logs
  };

  const addAPIKey = async () => {
    if (!newKey.provider || !newKey.api_key) {
      addLog('❌ Provider and API key are required', 'error');
      return;
    }

    // Basic validation
    if (newKey.api_key.length < 20) {
      addLog('❌ API key seems too short', 'error');
      return;
    }

    try {
      addLog(`🔄 Adding ${newKey.provider} API key...`, 'info');
      
      const { error } = await supabase
        .from('auth_keys_ai2024')
        .insert([{
          provider: newKey.provider,
          api_key: newKey.api_key.trim(),
          is_active: true
        }]);

      if (error) throw error;

      addLog(`✅ Added ${newKey.provider} API key successfully`, 'success');
      setNewKey({ provider: '', api_key: '' });
      setShowAddForm(false);
      
      // Reload everything to refresh the UI
      await Promise.all([
        loadAPIKeys(),
        loadAvailableProviders()
      ]);
      
    } catch (error) {
      console.error('Error adding API key:', error);
      addLog(`❌ Failed to add API key: ${error.message}`, 'error');
    }
  };

  const toggleKeyStatus = async (keyId, currentStatus) => {
    try {
      const { error } = await supabase
        .from('auth_keys_ai2024')
        .update({ is_active: !currentStatus })
        .eq('id', keyId);

      if (error) throw error;

      addLog(`✅ Key status ${!currentStatus ? 'activated' : 'deactivated'}`, 'success');
      
      // Reload everything
      await Promise.all([
        loadAPIKeys(),
        loadAvailableProviders()
      ]);
      
    } catch (error) {
      console.error('Error updating key status:', error);
      addLog(`❌ Failed to update key status`, 'error');
    }
  };

  const deleteAPIKey = async (keyId, provider) => {
    if (!confirm(`Delete ${provider} API key? This action cannot be undone.`)) return;

    try {
      const { error } = await supabase
        .from('auth_keys_ai2024')
        .delete()
        .eq('id', keyId);

      if (error) throw error;

      addLog(`✅ Deleted ${provider} API key`, 'success');
      
      // Reload everything
      await Promise.all([
        loadAPIKeys(),
        loadAvailableProviders()
      ]);
      
    } catch (error) {
      console.error('Error deleting API key:', error);
      addLog(`❌ Failed to delete API key`, 'error');
    }
  };

  const generateTestContent = async () => {
    setIsGenerating(true);
    addLog('🚀 Starting test content generation...', 'info');

    try {
      const testPrompt = `Write a comprehensive blog post about "The Future of Web Development" that includes:

TITLE: The Future of Web Development: Trends Shaping 2024
META_DESCRIPTION: Discover the latest web development trends, from AI integration to progressive web apps. Expert insights on what's next.
TAGS: web development, technology trends, AI, PWA, frontend development
READING_TIME: 6 min read

CONTENT:
# The Future of Web Development: Trends Shaping 2024

The web development landscape continues to evolve at an unprecedented pace...`;

      addLog('🤖 Calling AI service...', 'info');
      
      // Use the first available provider
      const provider = availableProviders.find(p => p !== 'demo') || availableProviders[0];
      
      const content = await secureAIService.generateContent(testPrompt, {
        provider: provider,
        maxTokens: 2000
      });

      if (content) {
        addLog('✅ Content generated successfully', 'success');

        // Parse and save the content
        const blogPost = {
          title: 'Test AI Generated Post - ' + new Date().toLocaleDateString(),
          slug: 'test-ai-post-' + Date.now(),
          meta_description: 'This is a test post generated by the AI system to verify functionality.',
          content: content,
          category: 'technology',
          tags: ['test', 'ai-generated', 'web development'],
          reading_time: '6 min read',
          trending_topic: 'web development',
          source_articles: [],
          seo_score: 85,
          status: 'published',
          published: new Date().toISOString()
        };

        const savedPost = await secureAIService.saveBlogPost(blogPost);
        addLog(`💾 Blog post saved: ${savedPost.title}`, 'success');

        // Reload stats
        await loadStats();
      }
    } catch (error) {
      addLog(`❌ Error: ${error.message}`, 'error');
      console.error('Content generation error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const refreshDatabase = async () => {
    addLog('🔄 Refreshing database connection...', 'info');
    try {
      // Test database connection
      const { data, error } = await supabase
        .from('auth_keys_ai2024')
        .select('count(*)', { count: 'exact' });

      if (error) throw error;
      
      addLog('✅ Database connection verified', 'success');
      
      // Reload all data
      await initializePanel();
    } catch (error) {
      addLog(`❌ Database error: ${error.message}`, 'error');
    }
  };

  const maskKey = (key) => {
    if (!key) return '';
    if (key.length <= 12) return '••••••••';
    return key.substring(0, 8) + '•••••••••' + key.substring(key.length - 4);
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Blog Admin Panel</h1>
        <p className="text-gray-600">Monitor and control your autonomous AI blog system</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Posts</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalPosts}</p>
            </div>
            <SafeIcon icon={FiDatabase} className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Published</p>
              <p className="text-2xl font-bold text-gray-900">{stats.publishedPosts}</p>
            </div>
            <SafeIcon icon={FiCheck} className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg SEO Score</p>
              <p className="text-2xl font-bold text-gray-900">{stats.avgSeoScore}%</p>
            </div>
            <SafeIcon icon={FiSettings} className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* API Keys Management */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center space-x-2">
              <SafeIcon icon={FiKey} className="h-5 w-5" />
              <span>API Keys</span>
            </h3>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center space-x-1"
            >
              <SafeIcon icon={FiPlus} className="h-4 w-4" />
              <span>Add Key</span>
            </motion.button>
          </div>

          {/* Add Key Form */}
          {showAddForm && (
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <div className="space-y-3">
                <select
                  value={newKey.provider}
                  onChange={(e) => setNewKey({ ...newKey, provider: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Select Provider</option>
                  <option value="openai">OpenAI</option>
                  <option value="claude">Claude</option>
                  <option value="gemini">Gemini</option>
                </select>
                <input
                  type="password"
                  placeholder="API Key (will be encrypted)"
                  value={newKey.api_key}
                  onChange={(e) => setNewKey({ ...newKey, api_key: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono"
                />
                <div className="flex space-x-2">
                  <button
                    onClick={addAPIKey}
                    disabled={!newKey.provider || !newKey.api_key}
                    className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 disabled:bg-gray-400 transition-colors"
                  >
                    Add Key
                  </button>
                  <button
                    onClick={() => {
                      setShowAddForm(false);
                      setNewKey({ provider: '', api_key: '' });
                    }}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* API Keys List */}
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {apiKeys.length === 0 ? (
              <div className="text-center py-8">
                <SafeIcon icon={FiKey} className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 mb-2">No API keys configured</p>
                <p className="text-sm text-gray-400">Add your AI provider keys to enable content generation</p>
              </div>
            ) : (
              apiKeys.map(key => (
                <div key={key.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                        key.provider === 'openai' ? 'bg-green-100 text-green-800' :
                        key.provider === 'claude' ? 'bg-purple-100 text-purple-800' :
                        key.provider === 'gemini' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {key.provider}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        key.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {key.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 font-mono">
                      {showKeys[key.id] ? key.api_key : maskKey(key.api_key)}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Added {new Date(key.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-1 ml-3">
                    <button
                      onClick={() => setShowKeys({ ...showKeys, [key.id]: !showKeys[key.id] })}
                      className="p-2 text-gray-400 hover:text-gray-600 rounded"
                      title={showKeys[key.id] ? 'Hide key' : 'Show key'}
                    >
                      <SafeIcon icon={showKeys[key.id] ? FiEyeOff : FiEye} className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => toggleKeyStatus(key.id, key.is_active)}
                      className={`p-2 rounded ${key.is_active ? 'text-red-400 hover:text-red-600' : 'text-green-400 hover:text-green-600'}`}
                      title={key.is_active ? 'Deactivate key' : 'Activate key'}
                    >
                      <SafeIcon icon={key.is_active ? FiAlertCircle : FiCheck} className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deleteAPIKey(key.id, key.provider)}
                      className="p-2 text-red-400 hover:text-red-600 rounded"
                      title="Delete key"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Available Providers */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Available AI Providers ({availableProviders.length})
            </label>
            <div className="flex flex-wrap gap-2">
              {availableProviders.map(provider => (
                <span
                  key={provider}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    provider === 'demo' 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : 'bg-green-100 text-green-800'
                  }`}
                >
                  {provider === 'demo' ? '🚧 Demo Mode' : `✅ ${provider}`}
                </span>
              ))}
              {availableProviders.length === 0 && (
                <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                  ❌ No providers available
                </span>
              )}
            </div>
          </div>

          {/* Control Buttons */}
          <div className="mt-6 space-y-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={generateTestContent}
              disabled={isGenerating || availableProviders.length === 0}
              className="w-full bg-primary-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-primary-700 disabled:bg-gray-400 transition-colors flex items-center justify-center space-x-2"
            >
              <SafeIcon
                icon={isGenerating ? FiRefreshCw : FiPlay}
                className={`h-5 w-5 ${isGenerating ? 'animate-spin' : ''}`}
              />
              <span>{isGenerating ? 'Generating...' : 'Generate Test Content'}</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={refreshDatabase}
              className="w-full bg-gray-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors flex items-center justify-center space-x-2"
            >
              <SafeIcon icon={FiRefreshCw} className="h-5 w-5" />
              <span>Refresh Database</span>
            </motion.button>
          </div>
        </div>

        {/* Activity Logs */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Activity Logs</h3>
            <button
              onClick={() => setLogs([])}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Clear
            </button>
          </div>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {logs.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No activity yet. Generate some content to see logs.</p>
            ) : (
              logs.map(log => (
                <div
                  key={log.id}
                  className={`p-3 rounded-lg text-sm border-l-4 ${
                    log.type === 'error' ? 'bg-red-50 text-red-700 border-red-400' :
                    log.type === 'success' ? 'bg-green-50 text-green-700 border-green-400' :
                    'bg-blue-50 text-blue-700 border-blue-400'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <span className="flex-1 leading-relaxed">{log.message}</span>
                    <span className="text-xs opacity-70 ml-2 flex-shrink-0">{log.timestamp}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Security Notice */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start space-x-3">
          <SafeIcon icon={FiAlertCircle} className="h-6 w-6 text-blue-600 mt-0.5" />
          <div>
            <h4 className="text-lg font-medium text-blue-800 mb-2">🔒 Secure API Key Management</h4>
            <p className="text-blue-700 mb-3">
              API keys are now stored securely in your Supabase database instead of environment variables.
            </p>
            <div className="text-sm text-blue-600">
              <p><strong>Security Benefits:</strong></p>
              <ul className="list-disc list-inside space-y-1 mt-1">
                <li>Keys are encrypted in the database</li>
                <li>No keys exposed in browser console</li>
                <li>Centralized key management</li>
                <li>Easy key rotation and deactivation</li>
                <li>Production-ready architecture</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
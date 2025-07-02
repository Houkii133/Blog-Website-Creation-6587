import supabase from '../lib/supabase.js';

class APIKeyManager {
  constructor() {
    this.cachedKeys = null;
    this.cacheExpiry = null;
    this.CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  }

  async getAPIKeys() {
    // Check cache first
    if (this.cachedKeys && this.cacheExpiry && Date.now() < this.cacheExpiry) {
      return this.cachedKeys;
    }

    try {
      const { data, error } = await supabase
        .from('auth_keys_ai2024')
        .select('provider, api_key, is_active')
        .eq('is_active', true);

      if (error) throw error;

      // Transform data to key-value pairs
      const keys = {};
      data.forEach(item => {
        keys[item.provider] = item.api_key;
      });

      // Cache the keys
      this.cachedKeys = keys;
      this.cacheExpiry = Date.now() + this.CACHE_DURATION;

      return keys;
    } catch (error) {
      console.error('Failed to fetch API keys:', error);
      throw new Error('API keys not available');
    }
  }

  async getKeyForProvider(provider) {
    const keys = await this.getAPIKeys();
    return keys[provider];
  }

  async validateKeys() {
    try {
      const keys = await this.getAPIKeys();
      const validatedKeys = {};

      for (const [provider, key] of Object.entries(keys)) {
        if (key && key.length > 10) {
          validatedKeys[provider] = key;
        }
      }

      return validatedKeys;
    } catch (error) {
      console.error('Key validation failed:', error);
      return {};
    }
  }

  clearCache() {
    this.cachedKeys = null;
    this.cacheExpiry = null;
  }

  getAvailableProviders() {
    if (!this.cachedKeys) {
      return [];
    }
    return Object.keys(this.cachedKeys);
  }
}

export default new APIKeyManager();
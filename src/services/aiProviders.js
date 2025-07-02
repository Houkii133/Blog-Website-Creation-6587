// Production-ready AI Provider Manager with Supabase integration
import apiKeyManager from './apiKeyManager.js';

class AIProviderManager {
  constructor() {
    this.providers = {
      openai: null,
      claude: null,
      gemini: null
    };
    this.currentProvider = 'openai';
  }

  async initializeOpenAI() {
    try {
      const apiKey = await apiKeyManager.getKeyForProvider('openai');
      if (!apiKey) {
        throw new Error('OpenAI API key not configured');
      }

      const OpenAI = (await import('openai')).default;
      this.providers.openai = new OpenAI({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true // Required for client-side usage
      });
      
      return this.providers.openai;
    } catch (error) {
      console.warn('OpenAI SDK not available:', error.message);
      throw error;
    }
  }

  async initializeClaude() {
    try {
      const apiKey = await apiKeyManager.getKeyForProvider('claude');
      if (!apiKey) {
        throw new Error('Claude API key not configured');
      }

      const { Anthropic } = await import('@anthropic-ai/sdk');
      this.providers.claude = new Anthropic({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true // Required for client-side usage
      });
      
      return this.providers.claude;
    } catch (error) {
      console.warn('Claude SDK not available:', error.message);
      throw error;
    }
  }

  async initializeGemini() {
    try {
      const apiKey = await apiKeyManager.getKeyForProvider('gemini');
      if (!apiKey) {
        throw new Error('Gemini API key not configured');
      }

      const { GoogleGenerativeAI } = await import('@google/generative-ai');
      this.providers.gemini = new GoogleGenerativeAI(apiKey);
      
      return this.providers.gemini;
    } catch (error) {
      console.warn('Gemini SDK not available:', error.message);
      throw error;
    }
  }

  async generateContent(prompt, options = {}) {
    const { provider = this.currentProvider, maxTokens = 3000 } = options;

    try {
      switch (provider) {
        case 'openai':
          await this.initializeOpenAI();
          return await this.generateWithOpenAI(prompt, maxTokens);
        case 'claude':
          await this.initializeClaude();
          return await this.generateWithClaude(prompt, maxTokens);
        case 'gemini':
          await this.initializeGemini();
          return await this.generateWithGemini(prompt, maxTokens);
        default:
          throw new Error(`Unknown provider: ${provider}`);
      }
    } catch (error) {
      console.error(`Error with ${provider}:`, error.message);
      
      // Fallback to other providers
      if (provider !== 'openai') {
        console.log('Falling back to OpenAI...');
        try {
          await this.initializeOpenAI();
          return await this.generateWithOpenAI(prompt, maxTokens);
        } catch (fallbackError) {
          console.error('OpenAI fallback failed:', fallbackError.message);
        }
      }
      
      throw error;
    }
  }

  async generateWithOpenAI(prompt, maxTokens) {
    if (!this.providers.openai) {
      throw new Error('OpenAI not initialized');
    }

    const completion = await this.providers.openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert tech blogger and content creator. Write engaging, SEO-optimized blog posts that feel human and conversational."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: maxTokens,
      temperature: 0.7
    });

    return completion.choices[0].message.content;
  }

  async generateWithClaude(prompt, maxTokens) {
    if (!this.providers.claude) {
      throw new Error('Claude not initialized');
    }

    const message = await this.providers.claude.messages.create({
      model: "claude-3-sonnet-20240229",
      max_tokens: maxTokens,
      messages: [
        {
          role: "user",
          content: prompt
        }
      ]
    });

    return message.content[0].text;
  }

  async generateWithGemini(prompt, maxTokens) {
    if (!this.providers.gemini) {
      throw new Error('Gemini not initialized');
    }

    const model = this.providers.gemini.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        maxOutputTokens: maxTokens,
        temperature: 0.7
      }
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  }

  async getAvailableProviders() {
    try {
      const keys = await apiKeyManager.getAPIKeys();
      const available = Object.keys(keys).filter(provider => keys[provider]);
      return available.length > 0 ? available : ['demo'];
    } catch (error) {
      console.error('Failed to get available providers:', error);
      return ['demo'];
    }
  }
}

export default new AIProviderManager();
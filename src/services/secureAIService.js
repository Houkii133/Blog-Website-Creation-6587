// Production-ready Secure AI Service with Supabase Key Management
import supabase from '../lib/supabase.js';
import apiKeyManager from './apiKeyManager.js';

class SecureAIService {
  constructor() {
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return;
    
    try {
      await apiKeyManager.validateKeys();
      this.initialized = true;
      console.log('🔑 API key manager initialized');
    } catch (error) {
      console.error('Failed to initialize API keys:', error);
      throw error;
    }
  }

  async generateContent(prompt, options = {}) {
    await this.initialize();
    return this.generateViaBrowser(prompt, options);
  }

  // Production method - database keys via browser
  async generateViaBrowser(prompt, options) {
    const { provider = 'openai', maxTokens = 3000 } = options;

    try {
      switch (provider) {
        case 'openai':
          return await this.generateWithOpenAI(prompt, maxTokens);
        case 'claude':
          return await this.generateWithClaude(prompt, maxTokens);
        case 'gemini':
          return await this.generateWithGemini(prompt, maxTokens);
        default:
          throw new Error(`Unknown provider: ${provider}`);
      }
    } catch (error) {
      console.error(`Error with ${provider}:`, error.message);
      throw error;
    }
  }

  async generateWithOpenAI(prompt, maxTokens) {
    const apiKey = await apiKeyManager.getKeyForProvider('openai');
    if (!apiKey) {
      throw new Error('OpenAI API key not configured in database');
    }

    try {
      const OpenAI = (await import('openai')).default;
      const openai = new OpenAI({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true
      });

      const completion = await openai.chat.completions.create({
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
    } catch (error) {
      console.error('OpenAI generation failed:', error);
      throw error;
    }
  }

  async generateWithClaude(prompt, maxTokens) {
    const apiKey = await apiKeyManager.getKeyForProvider('claude');
    if (!apiKey) {
      throw new Error('Claude API key not configured in database');
    }

    try {
      const { Anthropic } = await import('@anthropic-ai/sdk');
      const claude = new Anthropic({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true
      });

      const message = await claude.messages.create({
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
    } catch (error) {
      console.error('Claude generation failed:', error);
      throw error;
    }
  }

  async generateWithGemini(prompt, maxTokens) {
    const apiKey = await apiKeyManager.getKeyForProvider('gemini');
    if (!apiKey) {
      throw new Error('Gemini API key not configured in database');
    }

    try {
      const { GoogleGenerativeAI } = await import('@google/generative-ai');
      const gemini = new GoogleGenerativeAI(apiKey);
      const model = gemini.getGenerativeModel({
        model: "gemini-1.5-flash",
        generationConfig: {
          maxOutputTokens: maxTokens,
          temperature: 0.7
        }
      });

      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Gemini generation failed:', error);
      throw error;
    }
  }

  // Save generated content to database
  async saveBlogPost(blogPost) {
    try {
      const { data, error } = await supabase
        .from('ai_generated_posts_ai2024')
        .insert([blogPost])
        .select()
        .single();

      if (error) throw error;

      console.log('✅ Blog post saved successfully:', data.title);
      return data;
    } catch (error) {
      console.error('Failed to save blog post:', error);
      throw error;
    }
  }

  // Get available AI providers from database
  async getAvailableProviders() {
    try {
      const keys = await apiKeyManager.getAPIKeys();
      const available = Object.keys(keys).filter(provider => keys[provider]);
      return available.length > 0 ? available : ['demo'];
    } catch (error) {
      console.error('Failed to get providers:', error);
      return ['demo'];
    }
  }

  // Generate demo content for testing
  generateDemoContent(prompt) {
    return `# Demo AI Content

This is a demonstration of how AI-generated content would appear. In a real implementation, this would be replaced with actual AI-generated text based on the prompt:

**Prompt**: ${prompt}

## Key Features

- SEO-optimized content structure
- Engaging headlines and subheadings
- Professional writing tone
- Relevant keywords integration

## Implementation Notes

- API keys are stored securely in Supabase database
- Supports multiple AI providers (OpenAI, Claude, Gemini)
- Production-ready architecture with proper error handling
- Real-time content generation and publishing

## Next Steps

1. Add your AI API keys to the Supabase database
2. Test content generation with real providers
3. Configure automated content scheduling
4. Monitor performance and SEO metrics

*This demo content was generated to show the expected format and structure.*`;
  }
}

export default new SecureAIService();
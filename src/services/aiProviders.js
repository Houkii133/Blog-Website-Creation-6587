import OpenAI from 'openai';

class AIProviderManager {
  constructor() {
    this.providers = {
      openai: new OpenAI({
        apiKey: process.env.OPENAI_API_KEY || import.meta.env.VITE_OPENAI_API_KEY
      }),
      claude: null, // Will initialize when needed
      gemini: null  // Will initialize when needed
    };
    
    this.currentProvider = 'openai'; // Default provider
  }

  async initializeClaude() {
    if (!this.providers.claude) {
      try {
        const { Anthropic } = await import('@anthropic-ai/sdk');
        this.providers.claude = new Anthropic({
          apiKey: process.env.ANTHROPIC_API_KEY || import.meta.env.VITE_ANTHROPIC_API_KEY
        });
      } catch (error) {
        console.warn('Claude SDK not available:', error.message);
      }
    }
    return this.providers.claude;
  }

  async initializeGemini() {
    if (!this.providers.gemini) {
      try {
        const { GoogleGenerativeAI } = await import('@google/generative-ai');
        this.providers.gemini = new GoogleGenerativeAI(
          process.env.GOOGLE_API_KEY || import.meta.env.VITE_GOOGLE_API_KEY
        );
      } catch (error) {
        console.warn('Gemini SDK not available:', error.message);
      }
    }
    return this.providers.gemini;
  }

  async generateContent(prompt, options = {}) {
    const { provider = this.currentProvider, maxTokens = 3000 } = options;

    try {
      switch (provider) {
        case 'openai':
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
        return await this.generateWithOpenAI(prompt, maxTokens);
      }
      
      throw error;
    }
  }

  async generateWithOpenAI(prompt, maxTokens) {
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

  // Rotate providers for load balancing
  rotateProvider() {
    const providers = ['openai', 'claude', 'gemini'];
    const currentIndex = providers.indexOf(this.currentProvider);
    this.currentProvider = providers[(currentIndex + 1) % providers.length];
    return this.currentProvider;
  }

  setProvider(provider) {
    if (['openai', 'claude', 'gemini'].includes(provider)) {
      this.currentProvider = provider;
    } else {
      throw new Error(`Invalid provider: ${provider}`);
    }
  }

  getAvailableProviders() {
    const available = [];
    
    if (process.env.OPENAI_API_KEY || import.meta.env.VITE_OPENAI_API_KEY) {
      available.push('openai');
    }
    
    if (process.env.ANTHROPIC_API_KEY || import.meta.env.VITE_ANTHROPIC_API_KEY) {
      available.push('claude');
    }
    
    if (process.env.GOOGLE_API_KEY || import.meta.env.VITE_GOOGLE_API_KEY) {
      available.push('gemini');
    }
    
    return available;
  }
}

export default new AIProviderManager();
import secureAIService from './secureAIService.js';
import supabase from '../lib/supabase.js';
import ContentScraper from './scraper.js';

class AIContentGenerator {
  constructor() {
    this.scraper = new ContentScraper();
  }

  async generateBlogPost(sourceArticles, category, trendingTopic) {
    console.log(`🤖 Generating blog post for ${category}: ${trendingTopic}`);

    try {
      const prompt = this.createPrompt(sourceArticles, category, trendingTopic);
      
      // Use secure AI service
      let generatedContent;
      const availableProviders = secureAIService.getAvailableProviders();
      
      if (availableProviders.includes('demo')) {
        // Demo mode - no API keys configured
        console.log('📝 Using demo content generation');
        generatedContent = secureAIService.generateDemoContent(prompt);
      } else {
        // Try available providers
        for (const provider of availableProviders) {
          try {
            console.log(`Trying ${provider} for content generation...`);
            generatedContent = await secureAIService.generateContent(prompt, {
              provider,
              maxTokens: 3000
            });
            
            if (generatedContent) {
              console.log(`✅ Successfully generated content with ${provider}`);
              break;
            }
          } catch (error) {
            console.warn(`${provider} failed:`, error.message);
            continue;
          }
        }
      }

      if (!generatedContent) {
        throw new Error('All AI providers failed to generate content');
      }

      // Parse the generated content
      const blogPost = this.parseGeneratedContent(
        generatedContent,
        category,
        trendingTopic,
        sourceArticles
      );

      // Save to database
      const savedPost = await secureAIService.saveBlogPost(blogPost);
      console.log(`✅ Generated blog post: "${blogPost.title}"`);
      
      return savedPost;
    } catch (error) {
      console.error('Error generating content:', error);
      return null;
    }
  }

  createPrompt(sourceArticles, category, trendingTopic) {
    const articlesText = sourceArticles.map(article => 
      `Title: ${article.title}\nSource: ${article.source}\nSummary: ${article.description}\n---`
    ).join('\n');

    return `
Based on these recent ${category} articles about "${trendingTopic}", write a comprehensive, engaging blog post that:

1. Has a compelling, SEO-friendly title
2. Includes a meta description (150-160 characters)
3. Uses a conversational, human tone
4. Provides unique insights and analysis
5. Is 1200-1500 words long
6. Includes relevant keywords naturally
7. Has clear sections with H2/H3 headings
8. Ends with a thought-provoking conclusion

Source Articles:
${articlesText}

Format your response as:
TITLE: [Your SEO-optimized title]
META_DESCRIPTION: [Your meta description]
TAGS: [5-7 relevant tags separated by commas]
READING_TIME: [estimated reading time]
CONTENT: [Your full blog post content with proper headings and structure]

Focus on what this means for readers, why it matters, and what trends to watch. Make it engaging and informative while maintaining credibility.
    `;
  }

  parseGeneratedContent(content, category, trendingTopic, sourceArticles) {
    const lines = content.split('\n');
    let title = '', metaDescription = '', tags = '', readingTime = '';
    let contentStart = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.startsWith('TITLE:')) {
        title = line.replace('TITLE:', '').trim();
      } else if (line.startsWith('META_DESCRIPTION:')) {
        metaDescription = line.replace('META_DESCRIPTION:', '').trim();
      } else if (line.startsWith('TAGS:')) {
        tags = line.replace('TAGS:', '').trim();
      } else if (line.startsWith('READING_TIME:')) {
        readingTime = line.replace('READING_TIME:', '').trim();
      } else if (line.startsWith('CONTENT:')) {
        contentStart = i + 1;
        break;
      }
    }

    const blogContent = lines.slice(contentStart).join('\n').trim();

    return {
      title: title || `The Latest in ${category}: ${trendingTopic}`,
      meta_description: metaDescription || `Discover the latest trends and insights in ${category}. Expert analysis and what it means for the future.`,
      content: blogContent,
      category,
      tags: tags.split(',').map(tag => tag.trim()),
      reading_time: readingTime || '5 min read',
      trending_topic: trendingTopic,
      source_articles: sourceArticles.map(a => ({
        title: a.title,
        url: a.link,
        source: a.source
      })),
      published: new Date(),
      slug: this.generateSlug(title || trendingTopic),
      seo_score: this.calculateSEOScore(title, blogContent, metaDescription),
      status: 'published'
    };
  }

  generateSlug(title) {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  }

  calculateSEOScore(title, content, metaDescription) {
    let score = 0;

    // Title length check
    if (title.length >= 30 && title.length <= 60) score += 20;

    // Meta description length check
    if (metaDescription.length >= 120 && metaDescription.length <= 160) score += 15;

    // Content length check
    if (content.length >= 1000) score += 20;

    // Heading structure check
    if (content.includes('##') || content.includes('<h2>')) score += 15;

    // Keyword density (simple check)
    const wordCount = content.split(' ').length;
    if (wordCount >= 300) score += 15;

    // Readability (simple sentence length check)
    const sentences = content.split(/[.!?]+/);
    const avgSentenceLength = wordCount / sentences.length;
    if (avgSentenceLength >= 15 && avgSentenceLength <= 25) score += 15;

    return Math.min(score, 100);
  }

  async generateDailyContent() {
    console.log('🚀 Starting daily content generation...');

    // Get trending topics from scraped articles
    const trendsByCategory = await this.scraper.getLatestTrends();
    const generatedPosts = [];

    for (const [category, articles] of Object.entries(trendsByCategory)) {
      if (articles.length >= 3) { // Need at least 3 articles to create a comprehensive post
        
        // Find the most common trending topic
        const topicCounts = {};
        articles.forEach(article => {
          const words = article.title.toLowerCase().split(' ');
          words.forEach(word => {
            if (word.length > 4) { // Filter short words
              topicCounts[word] = (topicCounts[word] || 0) + 1;
            }
          });
        });

        const trendingTopic = Object.keys(topicCounts).reduce((a, b) => 
          topicCounts[a] > topicCounts[b] ? a : b
        );

        // Take top 5 articles for this topic
        const relevantArticles = articles
          .filter(article => article.title.toLowerCase().includes(trendingTopic))
          .slice(0, 5);

        if (relevantArticles.length >= 2) {
          const blogPost = await this.generateBlogPost(relevantArticles, category, trendingTopic);
          if (blogPost) {
            generatedPosts.push(blogPost);
          }
        }
      }
    }

    console.log(`✅ Generated ${generatedPosts.length} blog posts`);
    return generatedPosts;
  }
}

export default AIContentGenerator;

// Run generator if called directly
if (typeof window === 'undefined' && process.argv[1].endsWith('contentGenerator.js')) {
  const generator = new AIContentGenerator();
  generator.generateDailyContent().then(() => {
    console.log('Content generation completed!');
    process.exit(0);
  }).catch(error => {
    console.error('Content generation failed:', error);
    process.exit(1);
  });
}
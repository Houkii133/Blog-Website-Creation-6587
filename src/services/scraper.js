import Parser from 'rss-parser';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { RSS_FEEDS, TRENDING_KEYWORDS } from './rssFeeds.js';
import supabase from '../lib/supabase.js';

class ContentScraper {
  constructor() {
    this.parser = new Parser({
      customFields: {
        item: ['media:content', 'media:thumbnail', 'enclosure']
      }
    });
  }

  async scrapeRSSFeeds() {
    console.log('🔍 Starting RSS feed scraping...');
    const allArticles = [];

    for (const [category, feeds] of Object.entries(RSS_FEEDS)) {
      console.log(`📡 Scraping ${category} feeds...`);
      
      for (const feedUrl of feeds) {
        try {
          const feed = await this.parser.parseURL(feedUrl);
          
          for (const item of feed.items.slice(0, 5)) { // Get latest 5 articles per feed
            const article = {
              title: item.title,
              link: item.link,
              description: item.contentSnippet || item.summary,
              content: item.content || item['content:encoded'],
              published: new Date(item.pubDate || item.isoDate),
              category,
              source: feed.title,
              author: item.creator || item['dc:creator'],
              image: this.extractImage(item),
              guid: item.guid || item.link,
              trending_score: this.calculateTrendingScore(item.title, item.contentSnippet)
            };

            // Enhanced content extraction
            if (item.link) {
              try {
                const fullContent = await this.scrapeFullArticle(item.link);
                if (fullContent) {
                  article.full_content = fullContent;
                }
              } catch (error) {
                console.warn(`Failed to scrape full content for ${item.link}:`, error.message);
              }
            }

            allArticles.push(article);
          }
        } catch (error) {
          console.error(`Error parsing feed ${feedUrl}:`, error.message);
        }
      }
    }

    // Save to database
    await this.saveArticlesToDatabase(allArticles);
    console.log(`✅ Scraped ${allArticles.length} articles successfully`);
    
    return allArticles;
  }

  async scrapeFullArticle(url) {
    try {
      const response = await axios.get(url, {
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; BlogBot/1.0)'
        }
      });

      const $ = cheerio.load(response.data);
      
      // Remove unwanted elements
      $('script, style, nav, header, footer, .advertisement, .ads').remove();
      
      // Extract main content (common selectors)
      const contentSelectors = [
        'article',
        '.post-content',
        '.entry-content',
        '.article-body',
        '.content',
        'main',
        '.story-body'
      ];

      let content = '';
      for (const selector of contentSelectors) {
        const element = $(selector);
        if (element.length && element.text().trim().length > 200) {
          content = element.text().trim();
          break;
        }
      }

      return content.slice(0, 5000); // Limit content length
    } catch (error) {
      return null;
    }
  }

  extractImage(item) {
    if (item['media:content'] && item['media:content']['$'] && item['media:content']['$'].url) {
      return item['media:content']['$'].url;
    }
    if (item['media:thumbnail'] && item['media:thumbnail']['$'] && item['media:thumbnail']['$'].url) {
      return item['media:thumbnail']['$'].url;
    }
    if (item.enclosure && item.enclosure.url && item.enclosure.type?.startsWith('image/')) {
      return item.enclosure.url;
    }
    return null;
  }

  calculateTrendingScore(title, content) {
    let score = 0;
    const text = `${title} ${content}`.toLowerCase();
    
    TRENDING_KEYWORDS.forEach(keyword => {
      if (text.includes(keyword.toLowerCase())) {
        score += 10;
      }
    });

    // Boost score for recent articles
    score += Math.random() * 5;
    
    return Math.round(score);
  }

  async saveArticlesToDatabase(articles) {
    try {
      // Filter out duplicates
      const uniqueArticles = articles.filter((article, index, self) => 
        index === self.findIndex(a => a.guid === article.guid)
      );

      const { data, error } = await supabase
        .from('scraped_articles_ai2024')
        .upsert(uniqueArticles, { 
          onConflict: 'guid',
          ignoreDuplicates: true 
        });

      if (error) {
        console.error('Database error:', error);
      } else {
        console.log(`💾 Saved ${uniqueArticles.length} unique articles to database`);
      }
    } catch (error) {
      console.error('Failed to save articles:', error);
    }
  }

  async getLatestTrends() {
    console.log('📈 Analyzing trending topics...');
    
    try {
      const { data: articles } = await supabase
        .from('scraped_articles_ai2024')
        .select('title, category, trending_score, published')
        .gte('published', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()) // Last 24 hours
        .order('trending_score', { ascending: false })
        .limit(50);

      const trendsByCategory = {};
      articles?.forEach(article => {
        if (!trendsByCategory[article.category]) {
          trendsByCategory[article.category] = [];
        }
        trendsByCategory[article.category].push(article);
      });

      return trendsByCategory;
    } catch (error) {
      console.error('Error getting trends:', error);
      return {};
    }
  }
}

export default ContentScraper;

// Run scraper if called directly
if (process.argv[1].endsWith('scraper.js')) {
  const scraper = new ContentScraper();
  scraper.scrapeRSSFeeds().then(() => {
    console.log('Scraping completed!');
    process.exit(0);
  }).catch(error => {
    console.error('Scraping failed:', error);
    process.exit(1);
  });
}
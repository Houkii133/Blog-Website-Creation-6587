import cron from 'node-cron';
import ContentScraper from './scraper.js';
import AIContentGenerator from './contentGenerator.js';

class ContentScheduler {
  constructor() {
    this.scraper = new ContentScraper();
    this.generator = new AIContentGenerator();
  }

  startScheduler() {
    console.log('🕐 Starting content scheduler...');

    // Scrape RSS feeds every 2 hours
    cron.schedule('0 */2 * * *', async () => {
      console.log('⏰ Running scheduled RSS scraping...');
      try {
        await this.scraper.scrapeRSSFeeds();
      } catch (error) {
        console.error('Scheduled scraping failed:', error);
      }
    });

    // Generate AI content twice daily (8 AM and 6 PM)
    cron.schedule('0 8,18 * * *', async () => {
      console.log('⏰ Running scheduled content generation...');
      try {
        await this.generator.generateDailyContent();
      } catch (error) {
        console.error('Scheduled content generation failed:', error);
      }
    });

    // Weekly trend analysis (Sunday at midnight)
    cron.schedule('0 0 * * 0', async () => {
      console.log('⏰ Running weekly trend analysis...');
      try {
        await this.performWeeklyAnalysis();
      } catch (error) {
        console.error('Weekly analysis failed:', error);
      }
    });

    console.log('✅ Content scheduler started successfully');
  }

  async performWeeklyAnalysis() {
    // Analyze trending topics over the past week
    // Update trending keywords
    // Generate weekly summary posts
    console.log('📊 Performing weekly trend analysis...');
  }

  async runImmediateUpdate() {
    console.log('🚀 Running immediate content update...');
    
    try {
      // Scrape latest feeds
      await this.scraper.scrapeRSSFeeds();
      
      // Generate new content
      await this.generator.generateDailyContent();
      
      console.log('✅ Immediate update completed');
    } catch (error) {
      console.error('Immediate update failed:', error);
    }
  }
}

export default ContentScheduler;
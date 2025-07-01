import ContentScheduler from './scheduler.js';
import ContentScraper from './scraper.js';
import AIContentGenerator from './contentGenerator.js';

class AutomatedRunner {
  constructor() {
    this.scheduler = new ContentScheduler();
    this.scraper = new ContentScraper();
    this.generator = new AIContentGenerator();
  }

  async start() {
    console.log('🚀 Starting Autonomous AI Blog System...');
    
    // Run initial content generation
    await this.runInitialSetup();
    
    // Start the scheduler for ongoing automation
    this.scheduler.startScheduler();
    
    console.log('✅ Autonomous AI Blog System is now running!');
    console.log('📊 Check the admin dashboard for real-time updates');
  }

  async runInitialSetup() {
    try {
      console.log('⚙️ Running initial setup...');
      
      // Step 1: Scrape initial content
      console.log('1️⃣ Scraping RSS feeds...');
      await this.scraper.scrapeRSSFeeds();
      
      // Step 2: Generate initial blog posts
      console.log('2️⃣ Generating AI content...');
      await this.generator.generateDailyContent();
      
      console.log('✅ Initial setup completed successfully');
    } catch (error) {
      console.error('❌ Initial setup failed:', error);
    }
  }

  async runManualUpdate() {
    console.log('🔄 Running manual content update...');
    await this.scheduler.runImmediateUpdate();
  }
}

export default AutomatedRunner;

// Auto-start if running in Node.js environment
if (typeof window === 'undefined') {
  const runner = new AutomatedRunner();
  runner.start();
}
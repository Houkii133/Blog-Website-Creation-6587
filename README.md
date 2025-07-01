# BlogSpace AI - Autonomous Blog System

An intelligent blogging platform that automatically scrapes trending topics and generates SEO-optimized content using AI.

## 🤖 Features

### Autonomous Content Generation
- **RSS Feed Scraping**: Monitors 30+ RSS feeds across technology, AI, business, art, animals, education, and science
- **Trend Analysis**: Identifies trending topics using keyword analysis and scoring algorithms
- **AI Content Creation**: Generates human-like, SEO-optimized blog posts using OpenAI GPT-4
- **Automated Scheduling**: Updates content twice daily with fresh articles

### SEO & Monetization
- **SEO Optimization**: Meta descriptions, structured data, keyword optimization
- **Google AdSense Integration**: Header, sidebar, in-article, and footer ad placements
- **Performance Tracking**: SEO scores, trending analysis, and content metrics
- **Responsive Design**: Mobile-first, premium UI/UX

### Technical Stack
- **Frontend**: React 18, Tailwind CSS, Framer Motion
- **Backend**: Supabase (PostgreSQL)
- **AI**: OpenAI GPT-4 API
- **Scraping**: RSS Parser, Cheerio, Axios
- **Automation**: Node-cron for scheduling

## 🚀 Setup Instructions

### 1. Environment Setup
```bash
# Install dependencies
npm install

# Environment variables (create .env file)
OPENAI_API_KEY=your-openai-api-key
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_KEY=your-supabase-service-key
```

### 2. Database Setup
Connect your Supabase project and run:
```bash
# Setup database tables
npm run setup-db
```

### 3. Google AdSense Setup
1. Apply for Google AdSense approval
2. Replace `ca-pub-your-adsense-id` in AdSense components
3. Add your ad unit IDs in `src/components/AdSense.jsx`

### 4. Start the System
```bash
# Development mode
npm run dev

# Start autonomous system
npm run start-ai

# Manual content generation
npm run generate
```

## 📊 Content Categories

The system automatically generates content for:
- **Technology**: Latest tech trends, gadgets, software
- **Artificial Intelligence**: AI developments, machine learning
- **Business**: Startup news, market trends, entrepreneurship
- **Art & Design**: Creative trends, design inspiration
- **Animals & Nature**: Wildlife news, conservation
- **Education**: EdTech, learning trends, academic research
- **Science**: Scientific discoveries, research breakthroughs

## 🔧 Configuration

### RSS Feeds
Add/modify RSS feeds in `src/services/rssFeeds.js`:
```javascript
export const RSS_FEEDS = {
  technology: [
    'https://techcrunch.com/feed/',
    'https://your-custom-feed.com/rss'
  ]
};
```

### AI Prompts
Customize content generation in `src/services/contentGenerator.js`:
- Adjust tone and style
- Modify SEO requirements
- Set content length preferences

### Automation Schedule
Modify automation frequency in `src/services/scheduler.js`:
```javascript
// Scrape every 2 hours (default)
cron.schedule('0 */2 * * *', async () => {
  await this.scraper.scrapeRSSFeeds();
});
```

## 📈 Performance Features

### SEO Optimization
- Automatic meta tag generation
- Structured data (Schema.org)
- Keyword density optimization
- Internal linking suggestions
- Sitemap generation

### Content Quality
- Human-like writing style
- Fact-checking against sources
- Readability optimization
- Trending topic identification
- Source attribution

### Monetization
- Strategic ad placement
- AdSense optimization
- Performance tracking
- Revenue analytics

## 🛠️ API Endpoints

The system provides REST APIs for:
- Content management
- Analytics data
- RSS feed status
- AI generation metrics

## 📱 Mobile Optimization

- Responsive design for all devices
- Progressive Web App (PWA) ready
- Fast loading times
- Touch-friendly interface

## 🔒 Security

- Content moderation
- Source verification
- Rate limiting
- SQL injection protection
- XSS prevention

## 📊 Analytics

Track performance with built-in analytics:
- Page views and engagement
- SEO performance scores
- Content generation metrics
- Revenue tracking (AdSense)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For support and questions:
- Email: support@blogspace-ai.com
- Documentation: [docs.blogspace-ai.com]
- Community: [Discord/Slack channel]

---

**Note**: Ensure you have proper permissions for RSS feeds and comply with OpenAI's usage policies. Always review generated content before publishing.
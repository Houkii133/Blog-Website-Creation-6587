# 🔒 Security Guidelines

## ⚠️ API Key Security Warning

**CRITICAL**: The current setup exposes AI API keys in the browser during development. This is **NOT SAFE** for production!

## 🚨 Current Security Issues

### Frontend API Keys (Development Only)
- ❌ OpenAI, Claude, and Gemini keys are visible in browser
- ❌ Anyone can inspect and steal your keys
- ❌ Keys will be included in your built JavaScript files
- ✅ Only use for local development/testing

## 🛡️ Production Security Solutions

### Option 1: Server-Side API (Recommended)
```javascript
// Backend API endpoint (Node.js/Express example)
app.post('/api/generate-content', async (req, res) => {
  const { prompt, options } = req.body;
  
  // API keys stored securely on server
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY // Server-side only
  });
  
  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }]
  });
  
  res.json({ content: completion.choices[0].message.content });
});
```

### Option 2: Supabase Edge Functions
```sql
-- Create secure database function
CREATE OR REPLACE FUNCTION generate_ai_content(prompt TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Call AI API from secure server environment
  -- API keys stored in Supabase secrets
  RETURN generated_content;
END;
$$;
```

### Option 3: Serverless Functions
- **Vercel Functions**: `/api/generate-content.js`
- **Netlify Functions**: `/.netlify/functions/generate-content.js`
- **AWS Lambda**: Serverless AI content generation

## 🔐 Environment Variables Security

### Safe for Frontend (VITE_ prefix):
```env
VITE_SUPABASE_URL=https://project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
VITE_ADSENSE_CLIENT_ID=ca-pub-1234567890
```

### NEVER expose in frontend:
```env
OPENAI_API_KEY=sk-...          # Server only
ANTHROPIC_API_KEY=sk-ant-...   # Server only
GOOGLE_API_KEY=AIza...         # Server only
SUPABASE_SERVICE_KEY=eyJhbGc... # Server only
```

## 🚀 Production Deployment Checklist

- [ ] Remove all `VITE_` prefixed AI API keys
- [ ] Implement server-side AI generation API
- [ ] Use environment variables on server only
- [ ] Enable CORS protection
- [ ] Add rate limiting
- [ ] Implement API authentication
- [ ] Monitor API usage and costs
- [ ] Set up error handling and fallbacks

## 🔍 Security Best Practices

1. **Never commit `.env` files**
2. **Use different keys for dev/production**
3. **Implement rate limiting**
4. **Monitor API usage**
5. **Rotate keys regularly**
6. **Use least privilege access**
7. **Log security events**

## 📊 Cost Management

AI API calls can be expensive:
- **OpenAI GPT-4**: ~$0.03-0.06 per 1K tokens
- **Claude**: ~$0.015 per 1K tokens  
- **Gemini**: ~$0.001 per 1K tokens

**Implement usage limits and monitoring!**
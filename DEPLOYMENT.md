# 🚀 ABCal Deployment Guide

Multiple deployment options for your ABCal household calendar app.

## 🌐 Deployment Options

### 1. **Netlify** (Recommended - Easiest)

**Steps:**
1. Push code to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Click "New site from Git"
4. Connect GitHub and select your repo
5. Deploy settings are auto-detected from `netlify.toml`
6. Add environment variables in Site settings > Environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

**Pros:** Free tier, automatic deployments, great performance
**Cons:** None significant

---

### 2. **Railway** (Great for Full-Stack)

**Steps:**
1. Go to [railway.app](https://railway.app)
2. Connect GitHub account
3. Import your repository
4. Railway auto-detects Next.js and deploys
5. Add environment variables in project settings

**Pros:** Simple, includes database hosting, great for growing apps
**Cons:** Less generous free tier than Netlify

---

### 3. **Render** (Developer Friendly)

**Steps:**
1. Push code to GitHub
2. Go to [render.com](https://render.com)
3. Create new "Static Site"
4. Connect GitHub repo
5. Use these settings:
   - Build Command: `npm run build`
   - Publish Directory: `out`
6. Add environment variables

**Pros:** Simple, reliable, good free tier
**Cons:** Slower cold starts on free tier

---

### 4. **GitHub Pages** (Completely Free)

**Steps:**
1. Enable GitHub Pages in repo settings
2. Push code - GitHub Actions will auto-deploy
3. Add secrets in repo Settings > Secrets:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`  
   - `SUPABASE_SERVICE_ROLE_KEY`

**Pros:** Completely free, integrated with GitHub
**Cons:** Static only (no server functions)

---

### 5. **Self-Hosted** (VPS/Server)

**Requirements:**
- Server with Node.js 18+
- PM2 or similar process manager

**Steps:**
```bash
# On your server
git clone your-repo
cd abcal
npm install
npm run build
npm start

# Or with PM2
npm install -g pm2
pm2 start npm --name "abcal" -- start
```

**Pros:** Full control, can be very cheap
**Cons:** Requires server management

---

## 🔧 **Environment Variables Needed:**

For ALL platforms, you need these environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## 🏆 **My Recommendations:**

### **For Beginners:** 
→ **Netlify** - Easiest setup, great free tier

### **For Growing Apps:** 
→ **Railway** - Scales well, includes database

### **For Budget-Conscious:** 
→ **GitHub Pages** - Completely free forever

### **For Full Control:** 
→ **Self-hosted VPS** - Cheapest long-term

## 🚀 **Quick Start Commands:**

```bash
# For Netlify/Render/Railway
git push origin main
# (Auto-deploys)

# For static deployment (GitHub Pages)
npm run build:static

# For self-hosted
npm run build && npm start
```

Pick the platform that fits your needs best! 🎯
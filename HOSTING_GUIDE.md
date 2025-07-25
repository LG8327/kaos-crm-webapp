# KAOS CRM - Deployment & Hosting Guide

## 🚀 **Hosting Options Overview**

Your Next.js KAOS CRM app can be deployed to several platforms. Here are the best options:

### **1. Vercel (Recommended) - Easiest**
- **Best for**: Next.js apps (made by Vercel team)
- **Cost**: Free tier available, $20/month for pro
- **Deploy time**: ~3 minutes
- **Custom domains**: Yes (free SSL)

### **2. Netlify - Popular Alternative**
- **Best for**: Static sites and Next.js
- **Cost**: Free tier available, $19/month for pro  
- **Deploy time**: ~5 minutes
- **Custom domains**: Yes (free SSL)

### **3. Railway - Full-Stack Friendly**
- **Best for**: Apps with databases
- **Cost**: $5/month after free credits
- **Deploy time**: ~10 minutes
- **Custom domains**: Yes

### **4. DigitalOcean App Platform**
- **Best for**: Scalable production apps
- **Cost**: $12/month minimum
- **Deploy time**: ~15 minutes
- **Custom domains**: Yes

---

## 🎯 **Option 1: Vercel (Recommended)**

### **Step 1: Prepare Your App**
```bash
# 1. Make sure your app builds successfully
npm run build

# 2. Create vercel.json configuration (optional but recommended)
```

Create `vercel.json` in your project root:
```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "env": {
    "NEXT_PUBLIC_SUPABASE_URL": "@supabase_url",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY": "@supabase_anon_key",
    "NEXT_PUBLIC_MAPBOX_TOKEN": "@mapbox_token"
  }
}
```

### **Step 2: Deploy to Vercel**

**Option A: Using Vercel CLI (Fastest)**
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy from your project directory
cd /Users/lukasgreen/Desktop/Desktop/KaosFinal\ -\ Webapp
vercel

# Follow the prompts:
# - Link to existing project? N
# - Project name: kaos-crm-webapp
# - Deploy? Y
```

**Option B: Using GitHub (Recommended for teams)**
```bash
# 1. Push your code to GitHub
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/kaos-crm-webapp.git
git push -u origin main

# 2. Go to vercel.com
# 3. Click "New Project"
# 4. Import from GitHub
# 5. Select your repository
# 6. Configure environment variables
# 7. Deploy
```

### **Step 3: Configure Environment Variables**
In Vercel dashboard → Settings → Environment Variables:
```
NEXT_PUBLIC_SUPABASE_URL = https://abhjpjrwkhmktyneuslz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = your_supabase_anon_key
NEXT_PUBLIC_MAPBOX_TOKEN = pk.eyJ1IjoibGc4MzI3IiwiYSI6ImNtOWNlbGJvaTBwOXoya3ExbXA2Z2toMGcifQ.zWXfHRo9YCzVgxVIpksaEg
```

### **Step 4: Custom Domain (Optional)**
1. Go to Vercel dashboard → Domains
2. Add your domain (e.g., `kaoscrm.com`)
3. Configure DNS records as shown
4. SSL certificate is automatic

---

## 🌐 **Option 2: Netlify**

### **Step 1: Build for Static Export**
Update `next.config.js`:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig
```

### **Step 2: Deploy**
```bash
# Build the static version
npm run build

# Install Netlify CLI
npm install -g netlify-cli

# Login and deploy
netlify login
netlify deploy --prod --dir=out
```

**Or drag & drop the `out` folder to netlify.com**

---

## 🚂 **Option 3: Railway**

### **Step 1: Install Railway CLI**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login
```

### **Step 2: Deploy**
```bash
# Initialize and deploy
railway init
railway up

# Set environment variables
railway variables set NEXT_PUBLIC_SUPABASE_URL=https://abhjpjrwkhmktyneuslz.supabase.co
railway variables set NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
railway variables set NEXT_PUBLIC_MAPBOX_TOKEN=your_token
```

---

## 🌊 **Option 4: DigitalOcean App Platform**

### **Step 1: Create App Spec**
Create `.do/app.yaml`:
```yaml
name: kaos-crm-webapp
services:
- name: web
  source_dir: /
  github:
    repo: yourusername/kaos-crm-webapp
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NEXT_PUBLIC_SUPABASE_URL
    value: https://abhjpjrwkhmktyneuslz.supabase.co
  - key: NEXT_PUBLIC_SUPABASE_ANON_KEY
    value: your_key
  - key: NEXT_PUBLIC_MAPBOX_TOKEN
    value: your_token
```

### **Step 2: Deploy**
1. Go to DigitalOcean App Platform
2. Create new app from GitHub
3. Select your repository
4. Configure build settings
5. Deploy

---

## 🔧 **Pre-Deployment Checklist**

### **1. Environment Variables**
Ensure these are set in your hosting platform:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://abhjpjrwkhmktyneuslz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_MAPBOX_TOKEN=pk.eyJ1IjoibGc4MzI3IiwiYSI6ImNtOWNlbGJvaTBwOXoza3ExbXA2Z2toMGcifQ.zWXfHRo9YCzVgxVIpksaEg
```

### **2. Build Test**
```bash
# Test local build
npm run build
npm start

# Check for errors in browser console
# Test all functionality
```

### **3. Update Supabase Settings**
In Supabase dashboard → Authentication → URL Configuration:
- Add your production URL to allowed origins
- Update redirect URLs if using OAuth

### **4. Domain Configuration**
```bash
# If using custom domain, update in:
# - Supabase allowed origins
# - Any CORS settings
# - Authentication redirect URLs
```

---

## 📊 **Hosting Comparison**

| Platform | Setup Time | Cost | Ease | Best For |
|----------|------------|------|------|----------|
| **Vercel** | 3 min | Free/Premium | ⭐⭐⭐⭐⭐ | Next.js apps |
| **Netlify** | 5 min | Free/Premium | ⭐⭐⭐⭐ | Static sites |
| **Railway** | 10 min | $5/month | ⭐⭐⭐⭐ | Full-stack |
| **DigitalOcean** | 15 min | $12/month | ⭐⭐⭐ | Production |

---

## 🚀 **Quick Start: Deploy Now**

**Fastest option (Vercel):**
```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Deploy (from your project directory)
cd "/Users/lukasgreen/Desktop/Desktop/KaosFinal - Webapp"
vercel

# 3. Follow prompts and you're live in ~3 minutes!
```

Your app will be available at a URL like: `https://kaos-crm-webapp-abc123.vercel.app`

## 🔒 **Security Notes**

- Your Supabase anon key is safe to expose (it's public by design)
- Mapbox token is also safe (public token)
- Never expose service role keys or private keys
- Use environment variables for all configuration
- Enable Supabase Row Level Security (RLS) for data protection

Choose Vercel for the easiest deployment experience with your Next.js app!

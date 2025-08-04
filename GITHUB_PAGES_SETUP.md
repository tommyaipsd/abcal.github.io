# 🚀 GitHub Pages Deployment Guide for ABCal

Follow these steps to deploy your ABCal household calendar to GitHub Pages **completely FREE!**

## 📋 Prerequisites

1. **GitHub account** (free)
2. **Supabase project** set up
3. **Repository pushed to GitHub**

## 🔧 Step-by-Step Setup

### **Step 1: Repository Setup**

1. **Create a new repository** on GitHub:
   - Repository name: `abcal` (or any name you prefer)
   - Make it **Public** (required for free GitHub Pages)
   - Initialize with README if starting fresh

2. **Push your code** to the repository:
   ```bash
   git init
   git add .
   git commit -m "Initial ABCal setup"
   git branch -M main
   git remote add origin https://github.com/YOURUSERNAME/abcal.git
   git push -u origin main
   ```

### **Step 2: Configure GitHub Secrets**

1. Go to your repository on GitHub
2. Click **Settings** tab
3. In the left sidebar, click **Secrets and variables** → **Actions**
4. Click **New repository secret** and add these **3 secrets**:

   **Secret 1:**
   - Name: `NEXT_PUBLIC_SUPABASE_URL`
   - Value: Your Supabase project URL (from Supabase dashboard)

   **Secret 2:**
   - Name: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Value: Your Supabase anonymous key

   **Secret 3:**
   - Name: `SUPABASE_SERVICE_ROLE_KEY`
   - Value: Your Supabase service role key

### **Step 3: Enable GitHub Pages**

1. In your repository, go to **Settings** tab
2. Scroll down to **Pages** section (left sidebar)
3. Under **Source**, select **GitHub Actions**
4. That's it! GitHub will now use our custom workflow

### **Step 4: Deploy**

1. **Push any change** to trigger deployment:
   ```bash
   git add .
   git commit -m "Enable GitHub Pages deployment"
   git push
   ```

2. **Watch the deployment**:
   - Go to **Actions** tab in your repository
   - You'll see the "Deploy ABCal to GitHub Pages" workflow running
   - Wait for it to complete (usually 2-3 minutes)

3. **Access your live site**:
   - Your site will be available at: `https://YOURUSERNAME.github.io/abcal/`
   - The URL will also be shown in the Pages settings

## 🎯 **Expected URLs**

- **Your live ABCal app**: `https://YOURUSERNAME.github.io/abcal/`
- **Custom domain** (optional): You can add a custom domain in Pages settings

## 🔍 **Troubleshooting**

### **Common Issues:**

**❌ Build fails with environment variables error:**
- Check that all 3 secrets are correctly added in repository settings
- Make sure secret names match exactly (case-sensitive)

**❌ App loads but can't connect to Supabase:**
- Verify your Supabase URL and keys are correct
- Check that your Supabase project allows connections from your GitHub Pages domain

**❌ 404 error when visiting the site:**
- Wait a few minutes for DNS propagation
- Check that GitHub Pages is enabled and source is set to "GitHub Actions"

**❌ Styling looks broken:**
- This usually fixes itself after a few minutes
- Try hard refresh (Ctrl+F5 or Cmd+Shift+R)

### **Check Deployment Status:**

1. Go to **Actions** tab in your GitHub repository
2. Click on the latest workflow run
3. Check for any error messages in the build logs

## 🔄 **Future Updates**

Every time you push changes to the `main` branch:
1. GitHub Actions automatically rebuilds your app
2. Deploys the updated version to GitHub Pages
3. Your live site updates within 2-3 minutes

## 💰 **Cost: $0 Forever!**

GitHub Pages is completely free for:
- ✅ Public repositories
- ✅ Unlimited bandwidth for reasonable use
- ✅ Free SSL certificates
- ✅ Custom domains

## 🎉 **You're Done!**

Your ABCal household calendar is now live on the internet, completely free, with automatic deployments! 

Share the URL with your household members and start organizing your family events! 📅✨
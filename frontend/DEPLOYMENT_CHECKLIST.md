# 🚀 GitHub Pages Deployment Checklist

## ✅ Pre-Deployment Checklist

### 1. Repository Settings

- [ ] Go to `https://github.com/STELLARION-gp/STELLARION/settings/pages`
- [ ] Set **Source** to: **GitHub Actions**
- [ ] Click Save

### 2. Add Environment Variables as GitHub Secrets

- [ ] Go to `https://github.com/STELLARION-gp/STELLARION/settings/secrets/actions`
- [ ] Click **New repository secret** for each variable:

#### Required Secrets:

```
Secret Name: VITE_API_BASE_URL
Value: https://your-production-backend.com (or your backend URL)

Secret Name: VITE_API_ENDPOINT
Value: /api

Secret Name: VITE_CHATBOT_PROVIDER
Value: custom

Secret Name: VITE_BACKEND_URL
Value: https://your-production-backend.com (same as API_BASE_URL)

Secret Name: VITE_CHATBOT_API_URL
Value: https://your-production-backend.com/api
```

### 3. Update Backend URL in Code (Optional)

If you want fallback values, update your API configuration files to use production URLs.

### 4. Test Build Locally

```bash
cd /Users/nimnapathum/Documents/GitHub/STELLARION/front-end/frontend
npm run build
npm run preview
```

- [ ] Verify the build completes successfully
- [ ] Test the preview site works correctly

### 5. Commit and Push

```bash
git add .
git commit -m "Setup GitHub Pages deployment"
git push origin main
```

### 6. Monitor Deployment

- [ ] Go to `https://github.com/STELLARION-gp/STELLARION/actions`
- [ ] Watch the deployment workflow
- [ ] Wait for green checkmark (✓)

### 7. Verify Live Site

- [ ] Visit: `https://stellarion-gp.github.io/STELLARION/`
- [ ] Test navigation between pages
- [ ] Check if assets load correctly
- [ ] Test API calls (if backend is deployed)

---

## 📝 Quick Reference

### Your Site URL:

```
https://stellarion-gp.github.io/STELLARION/
```

### Deploy Commands:

```bash
# Automatic (via git push)
git push origin main

# Manual (via gh-pages)
npm run deploy
```

### Check Deployment Status:

```
https://github.com/STELLARION-gp/STELLARION/actions
```

---

## 🔄 For Future Deployments

Every time you push to `main`, your site will automatically rebuild and deploy!

Just:

1. Make your changes
2. Commit: `git commit -m "Your message"`
3. Push: `git push origin main`
4. Wait ~3-5 minutes for deployment

---

## ⚠️ Common Issues & Solutions

### Issue: Build fails with "environment variable not found"

**Solution:** Add the missing environment variable as a GitHub Secret

### Issue: Routes return 404 on refresh

**Solution:** Already fixed! The 404.html redirect is in place

### Issue: Assets not loading (CORS or 404)

**Solution:**

- Check asset paths are relative
- Verify `base: '/STELLARION/'` in vite.config.ts
- Check browser console for errors

### Issue: API calls failing

**Solution:**

- Verify backend URL in GitHub Secrets
- Check if backend allows CORS from GitHub Pages domain
- Update backend CORS to include: `https://stellarion-gp.github.io`

---

## 🎉 You're All Set!

Once you complete this checklist, your site will be live on GitHub Pages!

**Need help?** Check `DEPLOYMENT.md` for detailed instructions.

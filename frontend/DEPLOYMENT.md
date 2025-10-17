# GitHub Pages Deployment Setup

This project is configured to deploy to GitHub Pages automatically.

## Setup Instructions

### 1. Enable GitHub Pages

1. Go to your GitHub repository: `https://github.com/STELLARION-gp/STELLARION`
2. Click on **Settings** → **Pages** (in the left sidebar)
3. Under **Source**, select:
   - Source: **GitHub Actions**
4. Save the settings

### 2. Update Configuration (if needed)

If your repository name is different from "STELLARION", update the `base` in `vite.config.ts`:

```typescript
base: '/YOUR-REPO-NAME/',
```

If you're deploying to a custom domain or user/org page (username.github.io), set:

```typescript
base: '/',
```

### 3. Deployment Methods

#### Method 1: Automatic Deployment (Recommended)

The site will automatically deploy when you push to the `main` branch.

1. Commit your changes:

   ```bash
   git add .
   git commit -m "Setup GitHub Pages deployment"
   ```

2. Push to your repository:

   ```bash
   git push origin main
   ```

3. The GitHub Actions workflow will automatically build and deploy your site
4. Check the **Actions** tab in GitHub to monitor the deployment progress
5. Your site will be live at: `https://stellarion-gp.github.io/STELLARION/`

#### Method 2: Manual Deployment

You can also deploy manually using the `gh-pages` package:

```bash
npm run deploy
```

This will:

1. Build your project (`npm run build`)
2. Deploy the `dist` folder to the `gh-pages` branch

**Note:** For manual deployment, you need to set the GitHub Pages source to the `gh-pages` branch in repository settings.

### 4. Environment Variables

If your project uses environment variables (`.env` file), you need to add them as GitHub Secrets:

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Add each environment variable from your `.env` file

Then update `.github/workflows/deploy.yml` to include them:

```yaml
- name: Build
  run: npm run build
  env:
    VITE_API_URL: ${{ secrets.VITE_API_URL }}
    VITE_FIREBASE_API_KEY: ${{ secrets.VITE_FIREBASE_API_KEY }}
    # Add other variables as needed
```

## Troubleshooting

### Issue: 404 errors for routes

If you're using React Router and getting 404 errors on page refresh:

1. Add a `404.html` file to your `public` folder that redirects to `index.html`
2. Or use Hash Router instead of Browser Router in your React app

### Issue: Assets not loading

Make sure all your asset imports use relative paths or the Vite asset handling system.

### Issue: API calls failing

Update your API base URLs to point to your production backend. Consider using environment variables:

```typescript
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
```

## Project Structure

```
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions workflow
├── dist/                       # Build output (generated)
├── public/
│   └── .nojekyll              # Prevents Jekyll processing
├── src/
├── vite.config.ts             # Vite config with base path
└── package.json               # Build and deploy scripts
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run deploy` - Manual deployment to GitHub Pages

## Live Site

Once deployed, your site will be available at:
**https://stellarion-gp.github.io/STELLARION/**

## Custom Domain (Optional)

To use a custom domain:

1. Add a `CNAME` file to the `public` folder with your domain
2. Configure your domain's DNS settings to point to GitHub Pages
3. Enable HTTPS in GitHub Pages settings

---

For more information, visit:

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html#github-pages)

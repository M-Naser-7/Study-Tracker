# 🚀 Deployment Guide - Step by Step

## Part 1: Deploy Backend on Render (5 minutes)

### Step 1: Sign Up / Login
1. Go to **https://render.com**
2. Click **Sign up** (or use GitHub login)
3. Create account

### Step 2: Create Web Service
1. Click **New +** button (top right)
2. Click **Web Service**
3. Select your **Study-Tracker** repo from the list
4. If not visible, click **Connect account** to authorize GitHub

### Step 3: Configure Service
Fill in these fields:

| Field | Value |
|-------|-------|
| **Name** | study-tracker-api |
| **Runtime** | Node |
| **Root Directory** | server |
| **Build Command** | `npm install` |
| **Start Command** | `node app.js` |

### Step 4: Add Environment Variables
1. Scroll down to **Environment**
2. Click **Add Environment Variable** and add these:

| Key | Value |
|-----|-------|
| `MONGO_URI` | `mongodb+srv://MuntasirNaser:AaQ3BMGd34hOJkBb@cluster0.ifbihx5.mongodb.net/student_productivity?retryWrites=true&w=majority&appName=Cluster0` |
| `JWT_SECRET` | `study-tracker-secret-key-2024` |
| `NODE_ENV` | `production` |

### Step 5: Deploy
1. Click **Create Web Service** button (bottom right)
2. Wait 2-3 minutes for deployment
3. When done, you'll see a green checkmark
4. **Copy your URL** (looks like: `https://study-tracker-api.onrender.com`)

**Save this URL!** You'll need it for the frontend.

---

## Part 2: Deploy Frontend on Netlify (5 minutes)

### Step 1: Sign Up / Login
1. Go to **https://netlify.com**
2. Click **Sign up** (use GitHub login)
3. Authorize your GitHub account

### Step 2: Deploy from Git
1. Click **Add new site** (or **New site from Git**)
2. Choose **GitHub**
3. Search for **Study-Tracker** repo
4. Click to select it

### Step 3: Configure Build
Leave these as default:
- **Base directory:** (empty)
- **Build command:** (empty)
- **Publish directory:** client

### Step 4: Deploy
1. Click **Deploy site**
2. Wait 1-2 minutes
3. You'll get a URL like: `https://study-tracker-xxx.netlify.app`

### Step 5: Connect Frontend to Backend
1. Go back to your local VS Code
2. Open `client/config.js`
3. Replace this line:
   ```javascript
   window.API_BASE = "http://localhost:5000/api";
   ```
   With:
   ```javascript
   window.API_BASE = "https://your-render-url/api";
   ```
   (Use your actual Render URL from Step 1)

4. Save the file
5. In terminal, run:
   ```bash
   cd "d:\CODES\VS Code files\practice\HTML codes\gitProject1"
   git add client/config.js
   git commit -m "Update API base URL for production"
   git push origin main
   ```

6. Netlify will auto-deploy within 1 minute
7. Your site is now LIVE! 🎉

---

## Done! Your live website:
**Share this URL with friends:**
```
https://study-tracker-xxx.netlify.app
```

---

## If you get stuck:
- **Render won't deploy?** Check env variables are correct
- **Frontend won't connect?** Check Render URL is in config.js
- **Render deploys but gets 503?** Wait 30 seconds, refresh

# 📚 Student Productivity & Study Tracker

A full-stack web application where students can plan study tasks, track study time using a Pomodoro-style timer, and manage study notes—all in one place.

## 🎯 Features

- **User Authentication** - Secure registration & login with JWT
- **Study Planner** - Create, edit, delete tasks with priority & deadlines
- **Pomodoro Timer** - 25/50/10 min session options with automatic tracking
- **Study Session Logging** - Automatically saves completed sessions to history
- **Notes Section** - Add and manage study notes by subject
- **Real Analog Clock** - Live clock display in the timer panel
- **Modern UI** - Glassmorphic design with animated backgrounds

## 🛠️ Tech Stack

- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Atlas)
- **Auth:** JWT + bcryptjs
- **Deployment:** Render (backend), Netlify (frontend)

## 📋 Local Setup

### Prerequisites
- Node.js (v14+)
- MongoDB Atlas account (free tier)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/M-Naser-7/Study-Tracker.git
   cd Study-Tracker
   ```

2. **Backend Setup**
   ```bash
   cd server
   npm install
   cp .env.example .env
   # Edit .env and add your MongoDB Atlas URI and JWT secret
   npm run dev
   ```

3. **Frontend Setup**
   Open `client/index.html` in your browser or use a local server:
   ```bash
   cd client
   # Use any local server (e.g., VS Code Live Server)
   ```

## 🚀 Deployment

### Backend on Render

1. Create account at [Render.com](https://render.com)
2. New Web Service → Connect GitHub repo
3. Configure:
   - **Root Directory:** server
   - **Start Command:** node app.js
   - **Environment Variables:**
     - `MONGO_URI`: Your MongoDB Atlas connection string
     - `JWT_SECRET`: Any strong secret string
     - `NODE_ENV`: production

4. Deploy and copy the URL (e.g., `https://study-tracker-api.onrender.com`)

### Frontend on Netlify

1. Create account at [Netlify.com](https://netlify.com)
2. New Site from Git → Connect GitHub repo
3. Configure:
   - **Publish Directory:** client
   - **Build Command:** (leave empty)
4. Deploy

### Connect Frontend to Backend

After backend is deployed:

1. Edit `client/config.js`:
   ```javascript
   window.API_BASE = "https://your-render-url/api";
   ```

2. Commit and push to GitHub
3. Netlify will auto-redeploy

## 📁 Project Structure

```
Study-Tracker/
├── client/
│   ├── index.html
│   ├── login.html
│   ├── register.html
│   ├── dashboard.html
│   ├── app.js
│   ├── config.js
│   ├── styles.css
│   └── assets/
├── server/
│   ├── app.js
│   ├── package.json
│   ├── .env.example
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── middleware/
├── .gitignore
└── README.md
```

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login

### Tasks
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Notes
- `GET /api/notes` - Get all notes
- `POST /api/notes` - Create note
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note

### Study Sessions
- `POST /api/study/sessions` - Log study session
- `GET /api/study/sessions` - Get sessions (with date filters)
- `GET /api/study/daily` - Get daily totals

## 🎨 Customization

- Edit `client/styles.css` for colors and layout
- Modify timer durations in `client/app.js` setupTimer()
- Adjust authentication settings in `server/controllers/authController.js`

## 📝 License

MIT - Free to use and modify

## 👤 Author

M-Naser-7

---

**Happy studying! 🚀**

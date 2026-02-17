# 🚀 Quick Start Guide - FarmLease Frontend

## ✅ SETUP COMPLETE!

You are currently on the **`frontend-dev`** branch with a complete React + Tailwind CSS skeleton ready for development.

---

## 📋 What You Have

✅ **50+ Files Created**
- Complete React + Vite + Tailwind CSS setup
- 12 reusable UI components  
- 16 page skeletons (all user roles)
- API integration layer with JWT handling
- Authentication context
- Custom hooks and utilities
- Comprehensive documentation

---

## 🎯 Next Steps

### 1️⃣ Install Dependencies (REQUIRED)

```bash
cd frontend
npm install
```

This will install all required packages (~200MB).

### 2️⃣ Configure Environment

```bash
cp .env.example .env
```

Then edit `.env` and add your API keys:
```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_GEMINI_API_KEY=your_key_here
VITE_WEATHER_API_KEY=your_key_here
# ... etc
```

### 3️⃣ Start Development Server

```bash
npm run dev
```

Visit: **http://localhost:3000**

---

## 👥 For Team Development

### Each Developer Should:

1. **Clone and setup:**
   ```bash
   git clone <repository-url>
   cd Farm-Lease/frontend
   git checkout frontend-dev
   npm install
   cp .env.example .env
   ```

2. **Create a feature branch:**
   ```bash
   git checkout -b feature/your-name-task-name
   ```
   Example: `feature/john-land-browsing`

3. **Work on assigned tasks** (see TODO.md)

4. **Commit changes:**
   ```bash
   git add .
   git commit -m "feat: add land browsing filters"
   git push origin feature/your-name-task-name
   ```

5. **Create Pull Request** to `frontend-dev` branch

---

## 📚 Documentation Guide

Read these files in order:

1. **START HERE**: [README.md](README.md)
   - Project overview
   - Tech stack
   - Basic setup

2. **DEVELOPMENT**: [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md)
   - Component guidelines
   - Code standards
   - API integration
   - Troubleshooting

3. **TASKS**: [TODO.md](TODO.md)
   - Detailed task breakdown
   - Priority order
   - Phase-by-phase plan

4. **API**: [API_REFERENCE.md](API_REFERENCE.md)
   - All backend endpoints
   - Request/response formats
   - Usage examples

5. **STRUCTURE**: [PROJECT_TREE.md](PROJECT_TREE.md)
   - Complete file structure
   - What each file does
   - Statistics

---

## 💻 Common Commands

```bash
# Development
npm run dev          # Start dev server (port 3000)

# Building
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Check for errors

# Git
git status          # Check changes
git branch          # List branches
git checkout -b     # Create new branch
```

---

## 🎨 Component Usage

### Quick Examples

```jsx
// Button
import Button from '@/components/common/Button';

<Button variant="primary" onClick={handleClick}>
  Click Me
</Button>

// Input
import Input from '@/components/common/Input';

<Input
  label="Email"
  type="email"
  name="email"
  value={email}
  onChange={handleChange}
  error={errors.email}
  required
/>

// Protected Route
import ProtectedRoute from '@/components/common/ProtectedRoute';

<ProtectedRoute allowedRoles={['OWNER']}>
  <OwnerDashboard />
</ProtectedRoute>
```

More examples in DEVELOPER_GUIDE.md

---

## 🗂️ Project Structure

```
frontend/
├── src/
│   ├── components/     # UI components
│   ├── pages/          # Page components
│   ├── services/       # API calls
│   ├── hooks/          # Custom hooks
│   ├── context/        # State management
│   ├── utils/          # Utilities
│   └── constants/      # Constants
├── package.json        # Dependencies
├── vite.config.js      # Vite config
└── *.md               # Documentation
```

---

## 🎯 Task Assignment Suggestions

Divide work among developers:

**Developer 1 - Farm Owner Features**
- Complete MyLandsPage (lands grid)
- Implement AddLandPage (API integration)
- Create LeaseManagement pages

**Developer 2 - Lessee Features**
- Complete BrowseLandsPage (filters, search)
- Implement LandDetailPage (full details)
- Create lease request flow

**Developer 3 - Agro-Dealer Features**
- Complete MyProductsPage (product grid)
- Implement AddProductPage (API integration)
- Create product marketplace

**Developer 4 - Admin Features**
- Complete PendingLandsPage (verification)
- Implement UsersListPage (management)
- Create revenue dashboard

**Developer 5 - Shared Features**
- Map integration (Leaflet)
- Payment integration (M-Pesa)
- AI crop recommendations (Gemini)
- Additional UI components

---

## ⚠️ Important Notes

### Before You Start:
1. ✅ Make sure you're on `frontend-dev` branch
2. ✅ Run `npm install` in the frontend directory
3. ✅ Copy `.env.example` to `.env`
4. ✅ Read DEVELOPER_GUIDE.md

### While Developing:
- 💡 Follow component guidelines
- 💡 Use existing components
- 💡 Test responsiveness
- 💡 Handle errors properly
- 💡 Add loading states

### Before Pushing:
- ✅ Test your changes locally
- ✅ Check for console errors
- ✅ Ensure responsive design
- ✅ Write meaningful commit messages
- ✅ Push to your feature branch

---

## 🆘 Troubleshooting

**Dependencies won't install?**
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**Port 3000 already in use?**
```bash
npm run dev -- --port 3001
```

**Tailwind classes not working?**
- Restart dev server
- Clear browser cache

**API calls failing?**
- Check `.env` has correct `VITE_API_BASE_URL`
- Ensure backend is running
- Check browser console

More in DEVELOPER_GUIDE.md → Troubleshooting section

---

## 📞 Need Help?

1. Check the documentation files
2. Search in DEVELOPER_GUIDE.md
3. Look at existing components for examples
4. Ask project lead
5. Create an issue in repository

---

## ✨ You're Ready!

Everything is set up and documented. Just:

1. Install dependencies (`npm install`)
2. Set up `.env` file
3. Create your feature branch
4. Start coding!

**Happy coding! 🚜🌾**

---

*Generated: February 6, 2026*
*Branch: frontend-dev*
*Status: ✅ Ready for Development*

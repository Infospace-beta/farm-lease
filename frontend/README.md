# FarmLease Platform - Frontend

A React-based web application for the FarmLease Platform, connecting farm owners, lessees, and agro-dealers.

## 🚀 Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Form Management**: React Hook Form + Yup
- **State Management**: Context API
- **Maps**: Leaflet & React Leaflet
- **Notifications**: React Toastify
- **Icons**: Lucide React

## 📁 Project Structure

```
frontend/
├── public/                 # Static assets
├── src/
│   ├── assets/            # Images, fonts, etc.
│   ├── components/        # Reusable UI components
│   │   ├── common/        # Generic components (Button, Input, Modal, etc.)
│   │   ├── layout/        # Layout components (Navbar, Footer, Sidebar)
│   │   └── features/      # Feature-specific components
│   ├── pages/             # Page components
│   │   ├── auth/          # Authentication pages
│   │   ├── owner/         # Farm owner pages
│   │   ├── lessee/        # Lessee/farmer pages
│   │   ├── dealer/        # Agro-dealer pages
│   │   └── admin/         # Admin pages
│   ├── services/          # API service layer
│   ├── hooks/             # Custom React hooks
│   ├── context/           # Context providers
│   ├── utils/             # Utility functions
│   ├── constants/         # App constants
│   ├── App.jsx            # Main app component
│   ├── main.jsx           # Entry point
│   └── index.css          # Global styles
├── .env.example           # Environment variables template
├── package.json           # Dependencies
├── vite.config.js         # Vite configuration
└── tailwind.config.js     # Tailwind configuration
```

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository and navigate to frontend**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` with your actual API keys and configuration.

4. **Start development server**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:3000`

## 📝 Development Guidelines

### Branch Strategy
- `main` - Production-ready code
- `frontend-dev` - Main development branch
- `feature/*` - Individual feature branches

### Component Development
- Each component should be in its own file
- Use functional components with hooks
- Follow the naming convention: `ComponentName.jsx`
- Add PropTypes or use TypeScript for type checking

### Styling Guidelines
- Use Tailwind CSS utility classes
- Custom colors are defined in `tailwind.config.js`
- Mobile-first responsive design
- Maintain consistent spacing using Tailwind's spacing scale

### API Integration
- All API calls should go through the service layer
- Use environment variables for API endpoints
- Implement proper error handling and loading states

## 🎨 User Roles & Dashboards

1. **Farm Owners**: Manage land listings, view leases, track payments
2. **Lessees/Farmers**: Browse lands, lease farms, get AI recommendations
3. **Agro-Dealers**: Manage product listings, view inquiries
4. **Admin**: Verify lands, manage users, handle disputes

## 🚧 Development Workflow

### For Individual Developers

1. **Create your feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Work on your assigned component/page**
   - Follow the project structure
   - Implement your UI based on the wireframes
   - Connect to backend APIs using the service layer

3. **Test your changes**
   ```bash
   npm run dev
   ```

4. **Commit and push**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   git push origin feature/your-feature-name
   ```

5. **Create a Pull Request** to `frontend-dev`

## 📋 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔗 Integration Points

### Backend API
Base URL: `http://localhost:8000/api`

### External APIs
- **Gemini API**: AI crop recommendations
- **Weather API**: Climate data
- **M-Pesa Daraja**: Payment processing
- **OpenStreetMap**: Location services

## 📦 Key Features to Implement

### Phase 1 (Weeks 1-2)
- [ ] Authentication (Login/Register)
- [ ] Role-based dashboards
- [ ] Land listing and browsing
- [ ] Basic admin verification

### Phase 2 (Weeks 3-4)
- [ ] Payment integration UI
- [ ] Land detail pages
- [ ] Search and filter
- [ ] User profiles

### Phase 3 (Weeks 5-6)
- [ ] AI crop recommendations
- [ ] Agro-dealer marketplace
- [ ] Reviews and ratings
- [ ] Notifications

### Phase 4 (Weeks 7-8)
- [ ] Map integration
- [ ] Advanced analytics
- [ ] Reports and moderation
- [ ] Final polish and testing

## 🤝 Contributing

1. Follow the code style and structure
2. Write clean, readable code
3. Comment complex logic
4. Test your changes before pushing
5. Keep commits atomic and meaningful

## 📞 Support

For questions or issues, contact the project lead or create an issue in the repository.

---

**Happy Coding! 🚜🌾**

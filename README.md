# 🛒 Grocery ERP System

A comprehensive Enterprise Resource Planning system for grocery stores built with React.js frontend and Node.js backend, featuring real-time inventory management, order processing, and customer management.

## 🚀 Live Demo

- **Frontend**: [https://grocery-erp-frontend.onrender.com](https://grocery-erp-frontend.onrender.com) *(Update with your actual URL)*
- **Backend API**: [https://grocery-erp-backend.onrender.com](https://grocery-erp-backend.onrender.com) *(Update with your actual URL)*
- **API Health**: [https://grocery-erp-backend.onrender.com/api/health](https://grocery-erp-backend.onrender.com/api/health)

> **Note**: Replace the URLs above with your actual Render service URLs after deployment.

## 📋 Features

### 🏪 Core Functionality
- **Inventory Management**: Real-time stock tracking and management
- **Product Catalog**: Comprehensive product management with categories
- **Order Processing**: Complete order lifecycle management
- **Customer Management**: Customer profiles and purchase history
- **Real-time Updates**: Socket.IO integration for live updates

### 🔐 Security & Performance
- JWT-based authentication
- Rate limiting and security middleware
- Data validation and sanitization
- Optimized database queries
- Responsive design with Tailwind CSS

### 🛠️ Technical Features
- RESTful API architecture
- MongoDB database with Mongoose ODM
- Real-time communication with Socket.IO
- Comprehensive error handling
- Health check endpoints
- Docker containerization
- CI/CD with GitHub Actions

## 🏗️ Architecture

```
grocery-erp-system/
├── grocery-erp-frontend/     # React.js frontend
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── config/          # Configuration files
│   │   └── utils/           # Utility functions
│   └── public/              # Static assets
├── grocery-erp-backend/      # Node.js backend
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── models/          # MongoDB models
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Custom middleware
│   │   └── utils/           # Utility functions
│   └── tests/               # Test files
├── scripts/                 # Deployment scripts
├── .github/workflows/       # CI/CD workflows
└── render.yaml             # Render deployment config
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- MongoDB Atlas account (free tier)
- Git

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/grocery-erp-system.git
   cd grocery-erp-system
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**
   ```bash
   # Backend (.env)
   cp grocery-erp-backend/.env.example grocery-erp-backend/.env
   
   # Frontend (.env)
   cp grocery-erp-frontend/.env.example grocery-erp-frontend/.env
   ```

4. **Start development servers**
   ```bash
   # Terminal 1 - Backend
   npm run dev:backend
   
   # Terminal 2 - Frontend
   npm run dev:frontend
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - API Health: http://localhost:5000/api/health

## 🌐 Deployment

### Deploy to Render (Recommended)

1. **Fork this repository**

2. **Set up MongoDB Atlas**
   - Create a free cluster
   - Get your connection string
   - Whitelist Render IPs

3. **Deploy to Render**
   - Connect your GitHub repository to Render
   - Render will automatically detect `render.yaml`
   - Set environment variables in Render dashboard

4. **Configure GitHub Secrets** (for CI/CD)
   ```
   RENDER_API_KEY=your_render_api_key
   RENDER_BACKEND_SERVICE_ID=srv_xxxxx
   RENDER_FRONTEND_SERVICE_ID=srv_xxxxx
   ```

For detailed deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md).

### Manual Deployment

```bash
# Build and deploy
npm run build:all
npm run deploy
```

## 🧪 Testing

```bash
# Run all tests
npm run test:all

# Backend tests only
npm run test:backend

# Frontend tests only
npm run test:frontend

# Health check
npm run health-check
```

## 📊 API Documentation

### Health Endpoints
- `GET /api/health` - Application health status
- `GET /api/ready` - Readiness check
- `GET /api/live` - Liveness check

### Core API Endpoints
- `POST /api/v1/auth/login` - User authentication
- `GET /api/v1/products` - Get all products
- `POST /api/v1/products` - Create new product
- `GET /api/v1/inventory` - Get inventory status
- `POST /api/v1/orders` - Create new order
- `GET /api/v1/customers` - Get customer list

For complete API documentation, import `Grocery_ERP_API_Postman_Collection.json` into Postman.

## 🔧 Configuration

### Environment Variables

#### Backend
```env
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
FRONTEND_URL=https://your-frontend.onrender.com
```

#### Frontend
```env
REACT_APP_API_URL=https://your-backend.onrender.com
REACT_APP_SOCKET_URL=https://your-backend.onrender.com
```

## 🛡️ Security

- Helmet.js for security headers
- CORS configuration
- Rate limiting
- Input validation and sanitization
- MongoDB injection prevention
- XSS protection
- JWT token authentication

## 📈 Performance

- Compression middleware
- Database connection pooling
- Optimized React builds
- CDN delivery via Render
- Image optimization
- Code splitting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📧 Email: support@grocery-erp.com
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/grocery-erp-system/issues)
- 📖 Documentation: [Wiki](https://github.com/yourusername/grocery-erp-system/wiki)

## 🙏 Acknowledgments

- React.js team for the amazing frontend framework
- Node.js community for the robust backend platform
- MongoDB for the flexible database solution
- Render for the seamless deployment platform
- All contributors who helped build this system

---

**Built with ❤️ for grocery store owners worldwide**
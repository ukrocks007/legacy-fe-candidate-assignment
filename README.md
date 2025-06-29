## Web3 Message Signer & Verifier 🔐

A full-stack Web3 application that allows users to authenticate with Dynamic.xyz embedded wallets, sign custom messages, and verify signatures on the backend.

![Web3 Message Signer](https://img.shields.io/badge/Web3-Message_Signer-blue)
![React](https://img.shields.io/badge/React-19.1.0-61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178C6)
![Express](https://img.shields.io/badge/Express-4.18.2-000000)
![Dynamic.xyz](https://img.shields.io/badge/Dynamic.xyz-4.20.9-purple)

## 🎯 Features

- 🔑 **Dynamic.xyz Authentication**: Seamless wallet connection with embedded wallets
- ✍️ **Message Signing**: Sign custom messages with connected wallet
- ✅ **Signature Verification**: Backend verification using ethers.js
- 📱 **Responsive UI**: Beautiful design with Tailwind CSS and dark mode
- 📝 **Message History**: Persistent local history with localStorage
- 🔒 **Multi-Factor Auth**: Enhanced security with Dynamic.xyz headless MFA
- 🧪 **Comprehensive Testing**: Full test suite with 15+ passing tests
- 🐳 **Docker Support**: Complete containerization setup

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18.0+ and npm
- **Dynamic.xyz Account** for environment ID
- **Git** for cloning the repository

### 1. Clone the Repository

```bash
git clone https://github.com/DM-SaaS/legacy-fe-candidate-assignment.git
cd legacy-fe-candidate-assignment
```

### 2. Install Dependencies

```bash
# Install dependencies for both frontend and backend
npm run install:all
```

### 3. Environment Configuration

#### Backend Environment

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:

```env
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

#### Frontend Environment

```bash
cd ../frontend
cp .env.example .env
```

Edit `frontend/.env`:

```env
# Get this from your Dynamic.xyz dashboard
VITE_DYNAMIC_ENVIRONMENT_ID=your_dynamic_environment_id_here
VITE_API_BASE_URL=http://localhost:3001
```

### 4. Dynamic.xyz Setup

1. Create account at [Dynamic.xyz](https://app.dynamic.xyz/)
2. Create a new project
3. Copy your Environment ID from the dashboard
4. Paste it in `frontend/.env` as `VITE_DYNAMIC_ENVIRONMENT_ID`
5. Configure wallet connectors (Ethereum) in Dynamic dashboard

### 5. Run the Application

#### Option A: Development Mode

```bash
# Start both frontend and backend
npm run dev

# Or run individually:
npm run dev:backend  # Backend on http://localhost:3001
npm run dev:frontend # Frontend on http://localhost:5173
```

#### Option B: Docker

```bash
# Build and run with Docker
npm run docker:build
npm run docker:up

# Frontend: http://localhost:3000
# Backend: http://localhost:3001
```

### 6. Run Tests

```bash
# Run all tests
npm test

# Backend tests only
cd backend && npm test
```

## 📖 Usage Guide

### 1. Connect Wallet

- Click "Connect Wallet" button
- Choose your preferred wallet option
- Complete Dynamic.xyz authentication

### 2. Sign Messages

- Enter your custom message in the text area
- Click "Sign Message"
- Approve the signature request in your wallet

### 3. View Results

- See signature verification results immediately
- Check message history in the history panel
- Re-verify any previous signatures

## 🏗️ Project Structure

```
├── frontend/                 # React + TypeScript frontend
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── types/          # TypeScript definitions
│   │   └── config/         # Configuration files
│   ├── public/             # Static assets
│   └── package.json
├── backend/                 # Node.js + Express backend
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── services/       # Business logic
│   │   ├── middleware/     # Express middleware
│   │   ├── routes/         # API routes
│   │   ├── validators/     # Input validation
│   │   ├── types/          # TypeScript definitions
│   │   └── __tests__/      # Test files
│   └── package.json
├── docker-compose.yml       # Docker configuration
└── README.md               # This file
```

## 🔌 API Endpoints

### Health Check

```http
GET /health
```

### Verify Signature

```http
POST /verify-signature
Content-Type: application/json

{
  "message": "Hello World",
  "signature": "0x1234567890abcdef..."
}
```

**Response:**

```json
{
  "isValid": true,
  "signer": "0x742d35Cc6bC40532c31C52Eb345b27C2b37A7c10",
  "originalMessage": "Hello World"
}
```

## 🛡️ Security Features

- **CORS Protection**: Configurable origins
- **Rate Limiting**: 100 requests per 15 minutes
- **Input Validation**: Comprehensive request validation
- **Helmet Security**: Security headers
- **Error Sanitization**: Safe error responses
- **Multi-Factor Authentication**: Dynamic.xyz headless MFA support

## 🧪 Testing

The project includes comprehensive testing:

- **API Tests**: Integration tests for all endpoints
- **Service Tests**: Unit tests for business logic
- **Validation Tests**: Input validation testing
- **Error Handling**: Error scenario coverage

```bash
# Run all tests
npm test

# Run tests in watch mode
cd backend && npm run test:watch
```

## 🚀 Deployment

### Frontend (Vercel)

**Live Demo**: [https://web3-signer-verifier.vercel.app/](https://web3-signer-verifier.vercel.app/)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/DM-SaaS/legacy-fe-candidate-assignment)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main

### Backend (Railway/Render)

1. Connect repository to Railway or Render
2. Set environment variables
3. Deploy backend service

## 📝 Trade-offs & Improvements

### Current Implementation

- ✅ **localStorage**: Simple persistence, works offline
- ✅ **In-memory state**: Fast, no database complexity
- ✅ **Client-side signing**: Secure, private keys never leave wallet

### Future Improvements

- 🔄 **Database Integration**: For production message history
- 🌐 **Multi-chain Support**: Support for other blockchains
- 📊 **Analytics**: Message signing analytics
- 🔄 **Real-time Updates**: WebSocket for live updates
- 🎨 **Advanced UI**: More interactive animations
- 🔐 **Role-based Access**: User permissions system

---

Built with ❤️ using React, TypeScript, Express, and Dynamic.xyz

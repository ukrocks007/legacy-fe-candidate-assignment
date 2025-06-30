## Web3 Message Signer & Verifier 🔐

A full-stack Web3 application that allows users to authenticate with Dynamic.xyz embedded wallets, sign custom messages, and verify signatures on the backend with comprehensive MFA support and modern UI features.

Works on mobile and desktop, providing a seamless user experience.

**Live Demo**: [https://web3-signer-verifier.vercel.app/](https://web3-signer-verifier.vercel.app/)

https://github.com/user-attachments/assets/ac03468a-b89b-4b30-bd00-bf60cc02066c

![Web3 Message Signer](https://img.shields.io/badge/Web3-Message_Signer-blue)
![React](https://img.shields.io/badge/React-19.1.0-61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178C6)
![Express](https://img.shields.io/badge/Express-4.18.2-000000)
![Dynamic.xyz](https://img.shields.io/badge/Dynamic.xyz-4.20.9-purple)
![Vite](https://img.shields.io/badge/Vite-7.0.0-646CFF)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1.11-38B2AC)

## 🎯 Features

### Core Features

- 🔑 **Dynamic.xyz Authentication**: Seamless wallet connection with embedded wallets and multi-provider support
- ✍️ **Message Signing**: Sign custom messages with connected wallet using ethers.js
- ✅ **Signature Verification**: Real-time backend verification with comprehensive validation
- 📱 **Responsive UI**: Beautiful design with Tailwind CSS, dark/light mode, and modern components
- 📝 **Message History**: Persistent local storage with message management and re-verification

### Security & Authentication

- 🔒 **Multi-Factor Authentication (MFA)**: Complete headless MFA implementation with Dynamic.xyz
  - QR code setup for authenticator apps (Google Authenticator, Authy, etc.)
  - TOTP (Time-based One-Time Password) verification
  - Backup recovery codes generation and management
  - Device management (add, verify, delete devices)
- 🛡️ **Enhanced Security**: Rate limiting, CORS protection, helmet security headers
- 🔐 **Wallet Integration**: Support for multiple wallet types with automatic chain detection

### User Experience

- 🎨 **Modern Interface**: Clean, intuitive design with particle background effects
- 🌓 **Theme Support**: Comprehensive dark/light mode with system preference detection
- 🔄 **Health Monitoring**: Real-time backend health checks with status indicators
- 📊 **Dashboard Analytics**: Quick stats, message history, and account overview
- 👤 **Profile Management**: User settings, account information, and security preferences

### Development & Testing

- 🧪 **Comprehensive Testing**: Full test suite with 15+ passing tests covering API and services
- 🐳 **Docker Support**: Complete containerization setup for easy deployment
- 🚀 **Modern Tooling**: Vite, ESLint, Prettier, TypeScript, and hot reload
- 📦 **Monorepo Structure**: Organized workspace with frontend/backend separation

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18.0+ and npm
- **Dynamic.xyz Account** for environment ID and MFA configuration
- **Git** for cloning the repository
- **Docker** (optional) for containerized deployment

### Clone the Repository

```bash
git clone https://github.com/ukrocks007/legacy-fe-candidate-assignment.git
cd legacy-fe-candidate-assignment
```

### Quick Start Script

```bash
# Recommended to run the quick-start script to set up your environment
chmod +x quick-start.sh
# Ensure you have your Dynamic.xyz Environment ID ready
# Run quick-start script
./quick-start.sh your_dynamic_environment_id_here
```

### Manual Setup Steps

#### 1. Install Dependencies

```bash
# Install dependencies for both frontend and backend
npm run install:all
```

#### 2. Environment Configuration

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

#### 3. Dynamic.xyz Setup

1. Create account at [Dynamic.xyz](https://app.dynamic.xyz/)
2. Create a new project and configure settings:
   - **Wallet Connectors**: Enable Ethereum wallet connectors
   - **Multi-Factor Authentication**: Enable headless MFA from Settings > Security
   - **Authentication**: Configure embedded wallet options
3. Copy your Environment ID from the dashboard
4. Paste it in `frontend/.env` as `VITE_DYNAMIC_ENVIRONMENT_ID`
5. Configure allowed origins for CORS in Dynamic dashboard
6. Test wallet connection in Dynamic's developer console

#### 4. Run the Application

#### Option A: Development Mode

```bash
# Start both frontend and backend from the root directory
npm run dev
```

```bash
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

## 📖 Usage Guide

### 1. Connect Wallet

- Visit the landing page and click "Connect Wallet"
- Choose your preferred wallet provider (MetaMask, WalletConnect, etc.)
- Complete Dynamic.xyz authentication flow
- Your wallet address and connection status will be displayed

### 2. Dashboard Overview

- **Quick Stats**: View total signed messages and session information
- **Health Status**: Monitor backend connectivity with real-time health checks
- **Theme Toggle**: Switch between light and dark modes
- **Navigation**: Access Dashboard, Profile, and sign out options

### 3. Sign Messages

- Navigate to the Dashboard
- Enter your custom message in the text area (supports multi-line text)
- Click "Sign & Verify Message" to initiate the signing process
- Approve the signature request in your wallet
- View immediate verification results with signer address

### 4. Message History

- All signed messages are automatically saved to local storage
- View complete history with timestamps and verification status
- Clear entire history from Dashboard or Profile settings if needed

### 5. Multi-Factor Authentication Setup

- Go to Profile > Multi-Factor Authentication section
- Click "Add New Device" to set up MFA
- Scan the QR code with your authenticator app (Google Authenticator, Authy, 1Password, etc.)
- Enter the 6-digit verification code to complete setup
- Save backup recovery codes securely
- Manage multiple devices and regenerate recovery codes as needed

### 6. Profile Management

- **Account Information**: View wallet address, type, and chain details
- **Security Settings**: Configure MFA devices and backup codes
- **Account Actions**: Clear message history and manage preferences
- **Theme Preferences**: Automatic theme detection with manual override

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

### Authentication & Authorization

- **Dynamic.xyz Integration**: Secure wallet-based authentication with embedded wallet support
- **Multi-Factor Authentication**: Complete headless MFA implementation
  - TOTP (Time-based One-Time Password) verification
  - QR code setup for authenticator apps
  - Backup recovery codes with secure generation
  - Multiple device management and verification
- **Session Management**: Secure session handling with automatic cleanup

### API Security

- **CORS Protection**: Configurable cross-origin resource sharing
- **Rate Limiting**: Configurable rate limiting per IP
- **Input Validation**: Comprehensive request validation using express-validator
- **Helmet Security**: Security headers for XSS, CSRF, and clickjacking protection
- **Error Sanitization**: Safe error responses without sensitive information leakage

## 🧪 Testing

The project includes comprehensive testing coverage across multiple layers.

```bash
# Run all tests frontend + backend
npm test
```

## 🚀 Deployment

### Frontend (Vercel)

**Live Demo**: [https://web3-signer-verifier.vercel.app/](https://web3-signer-verifier.vercel.app/)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main

### Backend (Render)

**Live Demo**: [https://web3-verifier-backend.onrender.com](https://web3-verifier-backend.onrender.com)

1. Connect repository to Render
2. Set environment variables
3. Deploy backend service

## 📝 Trade-offs & Improvements

### Current Implementation (Trade-offs)

- ❌ **No persistent storage**: Message history is lost when the user clears browser data or switches devices
- ❌ **Limited scalability**: In-memory session may not scale well for large user bases

### Future Improvements

- 🔄 **Database Integration**: For production message history, user info & sessions
- 📊 **Analytics**: Message signing analytics
- ⚡ **Real-time Updates**: WebSocket for live updates
- 🎨 **Advanced UI**: More interactive animations
- 🔐 **Role-based Access**: User permissions system

---

Built with ❤️ using React, TypeScript, Express, and Dynamic.xyz

# Web3 Message Verifier Backend

A Node.js + Express + TypeScript backend API for verifying Ethereum message signatures.

## 🏗️ Architecture

This backend is built with:
- **Node.js** + **Express** for the web framework
- **TypeScript** for type safety
- **ethers.js** for Ethereum signature verification
- **Jest** for testing
- **ESLint** for code linting

## 📁 Project Structure

```
backend/
├── src/
│   ├── __tests__/           # Test files
│   ├── config/              # Configuration management
│   ├── controllers/         # Request handlers
│   ├── middleware/          # Express middleware
│   ├── routes/              # API routes
│   ├── services/            # Business logic
│   ├── types/               # TypeScript type definitions
│   ├── validators/          # Request validation
│   ├── app.ts               # Express app setup
│   └── index.ts             # Server entry point
├── dist/                    # Compiled JavaScript output
├── package.json
├── tsconfig.json
├── jest.config.js
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Edit `.env` file with your configuration:
```env
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Development

Start the development server with hot reload:
```bash
npm run dev
```

The server will start on `http://localhost:3001`

### Production

Build and start the production server:
```bash
npm run build
npm start
```

### Testing

Run the test suite:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

### Linting

Check code quality:
```bash
npm run lint
```

Auto-fix linting issues:
```bash
npm run lint:fix
```

## 📡 API Endpoints

### Health Check
- **GET** `/api/health`
- Returns server health status

### Signature Verification
- **POST** `/api/verify-signature`
- Verifies an Ethereum message signature

#### Request Body:
```json
{
  "message": "Hello World",
  "signature": "0x1234567890abcdef..."
}
```

#### Response (Success):
```json
{
  "isValid": true,
  "signer": "0x742d35Cc6bC40532c31C52Eb345b27C2b37A7c10",
  "originalMessage": "Hello World"
}
```

#### Response (Invalid):
```json
{
  "isValid": false,
  "signer": null,
  "originalMessage": "Hello World",
  "error": "Invalid signature format or verification failed"
}
```

## 🔧 Configuration

Environment variables:

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3001` | Server port |
| `NODE_ENV` | `development` | Environment mode |
| `CORS_ORIGIN` | `http://localhost:5173` | Allowed CORS origin |
| `RATE_LIMIT_WINDOW_MS` | `900000` | Rate limit window (15 min) |
| `RATE_LIMIT_MAX_REQUESTS` | `100` | Max requests per window |

## 🛡️ Security Features

- **CORS** protection with configurable origins
- **Helmet** for security headers
- **Rate limiting** to prevent abuse
- **Input validation** with express-validator
- **Error handling** with sanitized error messages

## 🧪 Testing Strategy

The backend includes comprehensive tests for:
- API endpoints (integration tests)
- Signature verification service (unit tests)
- Input validation
- Error handling

## 🏗️ Architecture Decisions

### Service Layer Pattern
- **Controllers** handle HTTP requests/responses
- **Services** contain business logic
- **Validators** handle input validation
- Clean separation of concerns

### Error Handling
- Centralized error handling middleware
- Consistent error response format
- Development vs production error details

### Type Safety
- Full TypeScript coverage
- Strict type checking enabled
- Custom type definitions for all interfaces

## 🚀 Deployment

### Docker (Optional)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist/ ./dist/
EXPOSE 3001
CMD ["node", "dist/index.js"]
```

### Build Process
```bash
npm run build  # Compiles TypeScript to JavaScript in dist/
```

## 🔄 Development Workflow

1. Make changes to TypeScript files in `src/`
2. Run tests: `npm test`
3. Check linting: `npm run lint`
4. Test locally: `npm run dev`
5. Build for production: `npm run build`

## 📈 Performance Considerations

- Rate limiting prevents abuse
- Efficient signature verification with ethers.js
- Minimal dependencies for fast startup
- Graceful shutdown handling

## 🤝 Contributing

1. Follow TypeScript best practices
2. Write tests for new features
3. Run linting before commits
4. Use conventional commit messages

## 📄 License

MIT License

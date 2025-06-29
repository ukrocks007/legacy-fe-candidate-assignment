# Render.com Backend Configuration

## Build Command

```bash
npm install
npm run build
```

## Start Command

```bash
npm start
```

## Environment Variables

Set these in your Render dashboard:

- `NODE_ENV`: `production`
- `PORT`: `10000` (Render default)
- `CORS_ORIGIN`: `https://your-frontend-domain.vercel.app`
- `RATE_LIMIT_WINDOW_MS`: `900000`
- `RATE_LIMIT_MAX_REQUESTS`: `100`

## Health Check

- **Path**: `/health`
- **Response**: 200 OK with JSON status

## Auto-Deploy

- Connect your GitHub repository
- Enable auto-deploy on main branch
- Deploy automatically on push

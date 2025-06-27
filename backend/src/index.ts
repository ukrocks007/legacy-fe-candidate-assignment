import { createApp } from './app';
import { config } from './config';

const startServer = (): void => {
  const app = createApp();

  const server = app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
    console.log(`Environment: ${config.nodeEnv}`);
    console.log(`CORS Origin: ${config.corsOrigin}`);
  });

  // Graceful shutdown
  const gracefulShutdown = (signal: string): void => {
    console.log(`Received ${signal}. Shutting down gracefully...`);
    server.close(() => {
      console.log('Server closed');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
};

if (require.main === module) {
  startServer();
}

export { startServer };


import http from 'node:http';

import app from './app.js';
import { env, validateEnv } from './config/env.js';

const PORT = Number(env.PORT) || 5000;

let server;

async function startServer() {
  try {
    // Validate required environment variables before accepting requests.
    validateEnv();

    server = http.createServer(app);

    server.listen(PORT, () => {
      console.log('');
      console.log('==========================================');
      console.log('  DIGITAL HEROES PRINTFORGE API');
      console.log('==========================================');
      console.log(`  Environment : ${env.NODE_ENV}`);
      console.log(`  Port        : ${PORT}`);
      console.log(`  API         : http://localhost:${PORT}/api`);
      console.log(`  Health      : http://localhost:${PORT}/api/health`);
      console.log('==========================================');
      console.log('');
    });

    server.on('error', (error) => {
      console.error('HTTP server error:', error);
      process.exitCode = 1;
    });
  } catch (error) {
    console.error('Failed to start PrintForge API:', error);
    process.exitCode = 1;
  }
}

async function shutdown(signal) {
  console.log(`\n${signal} received. Shutting down server...`);

  if (!server || !server.listening) {
    process.exit(0);
  }

  server.close((error) => {
    if (error) {
      console.error('Error during server shutdown:', error);
      process.exit(1);
    }

    console.log('HTTP server closed successfully.');
    process.exit(0);
  });

  // Allow time for active requests to finish.
  setTimeout(() => {
    console.error('Graceful shutdown timed out.');
    process.exit(1);
  }, 10000).unref();
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled promise rejection:', reason);
  if (server?.listening) {
    shutdown('UNHANDLED_REJECTION');
  } else {
    process.exitCode = 1;
  }
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
  if (server?.listening) {
    shutdown('UNCAUGHT_EXCEPTION');
  } else {
    process.exit(1);
  }
});

startServer();

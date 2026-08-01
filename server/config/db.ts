import mongoose from 'mongoose';

/**
 * Connect to MongoDB with retry logic and event listeners.
 * Call this before starting the Express server.
 */
export async function connectDB(): Promise<void> {
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/habib_portfolio';
  const MAX_RETRIES = 5;
  const RETRY_DELAY_MS = 3000;

  mongoose.connection.on('connected', () => {
    console.log(`[MongoDB] ✅ Connected to ${mongoose.connection.name}`);
  });

  mongoose.connection.on('error', (err) => {
    console.error('[MongoDB] ❌ Connection error:', err.message);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('[MongoDB] ⚠️  Disconnected');
  });

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      await mongoose.connect(MONGODB_URI, {
        dbName: process.env.MONGODB_DB_NAME || 'habib_portfolio',
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });
      return;
    } catch (err: any) {
      console.error(
        `[MongoDB] Connection attempt ${attempt}/${MAX_RETRIES} failed: ${err.message}`
      );
      if (attempt === MAX_RETRIES) {
        throw new Error(
          `[MongoDB] Failed to connect after ${MAX_RETRIES} attempts. Ensure MongoDB is running.`
        );
      }
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
    }
  }
}

/**
 * Gracefully close the MongoDB connection.
 */
export async function disconnectDB(): Promise<void> {
  await mongoose.disconnect();
  console.log('[MongoDB] Connection closed gracefully.');
}

// Handle process termination signals
process.on('SIGINT', async () => {
  await disconnectDB();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await disconnectDB();
  process.exit(0);
});

const app = require('./app');
const env = require('./config/env');
const { testConnection } = require('./config/db');

async function start() {
  const db = await testConnection();
  if (db.connected) {
    console.log('✓ MySQL connected');
  } else {
    console.warn('⚠ MySQL not connected:', db.error);
    console.warn('  The API will still start — set DATABASE_* in .env and create the database.');
  }

  app.listen(env.port, () => {
    console.log(`✓ Bella Modest Wear API running on http://localhost:${env.port}`);
    console.log(`  Environment: ${env.nodeEnv}`);
  });
}

start();

import { resetAndSeedDatabase } from './lib/database-cleanup-and-seed';
import mongoose from 'mongoose';

async function run() {
  try {
    console.log('🚀 Starting direct database reset...');
    await resetAndSeedDatabase();
    console.log('✅ Database reset successfully!');
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Reset failed:', error);
    process.exit(1);
  }
}

run();

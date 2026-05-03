import { resetAndSeedDatabase } from './lib/comprehensive-seeder';
import mongoose from 'mongoose';

async function run() {
  try {
    await resetAndSeedDatabase();
    console.log('✅ Seeding successful');
  } catch (err) {
    console.error('❌ Seeding failed:', err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

run();

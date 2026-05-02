import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { createComprehensiveSeedData, clearAllCollections } from '../lib/database-cleanup-and-seed';
import { connectDB } from '../lib/db';
import mongoose from 'mongoose';

async function runSeed() {
  try {
    console.log('🚀 Starting Database Seeding Process...');
    await connectDB();
    
    await clearAllCollections();
    await createComprehensiveSeedData();
    
    console.log('✅ Seeding Complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding Failed:', error);
    process.exit(1);
  }
}

runSeed();

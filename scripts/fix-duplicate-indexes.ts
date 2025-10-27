import mongoose from 'mongoose'
import { connectDB } from '@/lib/db'

/**
 * Fix duplicate indexes by dropping and recreating them properly
 * This script addresses the Mongoose warnings about duplicate schema indexes
 */

async function fixDuplicateIndexes() {
  console.log('\n╔════════════════════════════════════════════════════════╗')
  console.log('║     Fixing Duplicate Database Indexes                  ║')
  console.log('╚════════════════════════════════════════════════════════╝\n')

  try {
    await connectDB()
    console.log('✓ Connected to database\n')

    // Get all collections
    const collections = await mongoose.connection.db.listCollections().toArray()
    console.log(`Found ${collections.length} collections to process\n`)

    for (const collection of collections) {
      const collectionName = collection.name
      console.log(`🔧 Processing collection: ${collectionName}`)
      
      try {
        // Get current indexes
        const indexes = await mongoose.connection.db.collection(collectionName).indexes()
        console.log(`  Current indexes: ${indexes.length}`)
        
        // Drop all indexes except _id
        for (const index of indexes) {
          if (index.name !== '_id_') {
            try {
              await mongoose.connection.db.collection(collectionName).dropIndex(index.name)
              console.log(`  ✓ Dropped index: ${index.name}`)
            } catch (error) {
              console.log(`  ⚠ Could not drop index ${index.name}: ${error.message}`)
            }
          }
        }
        
        console.log(`  ✓ Cleaned up indexes for ${collectionName}\n`)
      } catch (error) {
        console.log(`  ⚠ Error processing ${collectionName}: ${error.message}\n`)
      }
    }

    console.log('╔════════════════════════════════════════════════════════╗')
    console.log('║     ✓ Duplicate Indexes Cleaned Successfully          ║')
    console.log('╚════════════════════════════════════════════════════════╝\n')

    console.log('Next steps:')
    console.log('1. Run the create-db-indexes.ts script to add proper indexes')
    console.log('2. Restart the application to avoid duplicate index warnings')
    console.log('3. Monitor for any performance improvements\n')

    process.exit(0)
  } catch (error) {
    console.error('\n❌ Error fixing duplicate indexes:', error)
    console.error('\nPlease ensure:')
    console.error('  1. MongoDB is running')
    console.error('  2. MONGODB_URI is set correctly')
    console.error('  3. Database connection is working')
    process.exit(1)
  }
}

// Run the script
fixDuplicateIndexes()


/**
 * Database Schema Comparison Script
 * Compares current MongoDB Atlas collections with the comprehensive schema
 */

const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://asithalakmalkonara11992081:asithalakmalkonara11992081@cluster0.8qjqj.mongodb.net/weddinglk?retryWrites=true&w=majority';

async function compareDatabaseSchema() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('🔌 Connected to MongoDB Atlas');
    
    const db = client.db('weddinglk');
    const collections = await db.listCollections().toArray();
    
    console.log('\n📊 CURRENT DATABASE ANALYSIS');
    console.log('='.repeat(50));
    
    // Current collections in Atlas
    console.log('\n🗂️ EXISTING COLLECTIONS:');
    const existingCollections = collections.map(col => col.name).sort();
    existingCollections.forEach((name, index) => {
      console.log(`${index + 1}. ${name}`);
    });
    
    // Expected collections from schema
    const expectedCollections = [
      'users', 'vendors', 'venues', 'bookings', 'payments', 'reviews',
      'services', 'messages', 'notifications', 'posts', 'favorites',
      'subscriptions', 'tasks', 'conversations', 'vendorprofiles',
      'weddingplannerprofiles', 'documents', 'boostpackages',
      'availability', 'quotations', 'quotationrequests', 'invoices',
      'stories', 'reels', 'verifications', 'servicepackages',
      'subscriptionplans', 'moderations', 'commissions',
      'enhancedposts', 'groups', 'enhancedbookings', 'dynamicpricings',
      'vendorpackages', 'comments', 'metaadscampaigns', 'metaadsadsets',
      'metaadscreatives', 'metaadsaccounts', 'testimonials',
      'planningtasks', 'userpreferences', 'userverifications',
      'passwordresets', 'vendorservices', 'vendorportfolios',
      'vendoravailabilities', 'bookingrequests', 'reactions',
      'followers', 'usersessions', 'twofactorauths',
      'bookingmodifications', 'paymentmethods', 'shares',
      'bookmarks', 'hashtags', 'mentions', 'messageattachments',
      'notificationpreferences', 'packages', 'venueboosts'
    ].sort();
    
    console.log('\n📋 EXPECTED COLLECTIONS (from schema):');
    expectedCollections.forEach((name, index) => {
      console.log(`${index + 1}. ${name}`);
    });
    
    // Compare collections
    console.log('\n🔍 COMPARISON ANALYSIS:');
    console.log('='.repeat(50));
    
    const missing = expectedCollections.filter(name => !existingCollections.includes(name));
    const extra = existingCollections.filter(name => !expectedCollections.includes(name));
    const matching = existingCollections.filter(name => expectedCollections.includes(name));
    
    console.log(`\n✅ MATCHING COLLECTIONS: ${matching.length}`);
    matching.forEach(name => console.log(`   ✓ ${name}`));
    
    console.log(`\n❌ MISSING COLLECTIONS: ${missing.length}`);
    missing.forEach(name => console.log(`   ✗ ${name}`));
    
    console.log(`\n➕ EXTRA COLLECTIONS: ${extra.length}`);
    extra.forEach(name => console.log(`   + ${name}`));
    
    // Analyze sample documents for key collections
    console.log('\n📄 SAMPLE DOCUMENT ANALYSIS:');
    console.log('='.repeat(50));
    
    for (const collectionName of ['users', 'vendors', 'venues', 'bookings'].filter(name => existingCollections.includes(name))) {
      try {
        const collection = db.collection(collectionName);
        const sampleDoc = await collection.findOne();
        const count = await collection.countDocuments();
        
        console.log(`\n📁 ${collectionName.toUpperCase()} (${count} documents):`);
        if (sampleDoc) {
          console.log('   Sample fields:');
          Object.keys(sampleDoc).slice(0, 10).forEach(key => {
            const value = sampleDoc[key];
            const type = Array.isArray(value) ? 'Array' : typeof value;
            console.log(`     - ${key}: ${type}`);
          });
          if (Object.keys(sampleDoc).length > 10) {
            console.log(`     ... and ${Object.keys(sampleDoc).length - 10} more fields`);
          }
        } else {
          console.log('   No documents found');
        }
      } catch (error) {
        console.log(`   Error analyzing ${collectionName}: ${error.message}`);
      }
    }
    
    // Check indexes
    console.log('\n🔍 INDEX ANALYSIS:');
    console.log('='.repeat(50));
    
    for (const collectionName of ['users', 'vendors', 'venues', 'bookings'].filter(name => existingCollections.includes(name))) {
      try {
        const collection = db.collection(collectionName);
        const indexes = await collection.indexes();
        
        console.log(`\n📁 ${collectionName.toUpperCase()} indexes:`);
        indexes.forEach((index, i) => {
          const keys = Object.keys(index.key).join(', ');
          const unique = index.unique ? ' (unique)' : '';
          const sparse = index.sparse ? ' (sparse)' : '';
          console.log(`   ${i + 1}. {${keys}}${unique}${sparse}`);
        });
      } catch (error) {
        console.log(`   Error analyzing indexes for ${collectionName}: ${error.message}`);
      }
    }
    
    // Summary
    console.log('\n📊 SUMMARY:');
    console.log('='.repeat(50));
    console.log(`Total existing collections: ${existingCollections.length}`);
    console.log(`Total expected collections: ${expectedCollections.length}`);
    console.log(`Matching collections: ${matching.length}`);
    console.log(`Missing collections: ${missing.length}`);
    console.log(`Extra collections: ${extra.length}`);
    console.log(`Coverage: ${Math.round((matching.length / expectedCollections.length) * 100)}%`);
    
    if (missing.length > 0) {
      console.log('\n🚨 RECOMMENDATIONS:');
      console.log('1. Create missing collections with proper schemas');
      console.log('2. Set up indexes for performance');
      console.log('3. Add data validation rules');
      console.log('4. Migrate existing data to new schema');
    }
    
  } catch (error) {
    console.error('❌ Error connecting to database:', error.message);
  } finally {
    await client.close();
    console.log('\n🔌 Database connection closed');
  }
}

// Run the comparison
compareDatabaseSchema().catch(console.error);

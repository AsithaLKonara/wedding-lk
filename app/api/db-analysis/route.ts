import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import mongoose from 'mongoose';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const db = mongoose.connection.db;
    
    // Get all collections
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(col => col.name).sort();
    
    // Expected collections from our schema
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
    
    // Compare collections
    const matching = collectionNames.filter(name => expectedCollections.includes(name));
    const missing = expectedCollections.filter(name => !collectionNames.includes(name));
    const extra = collectionNames.filter(name => !expectedCollections.includes(name));
    
    // Analyze key collections
    const keyCollections = ['users', 'vendors', 'venues', 'bookings', 'payments', 'reviews'];
    const collectionAnalysis = {};
    
    for (const collectionName of keyCollections) {
      if (collectionNames.includes(collectionName)) {
        try {
          const collection = db.collection(collectionName);
          const count = await collection.countDocuments();
          const sampleDoc = await collection.findOne();
          
          collectionAnalysis[collectionName] = {
            exists: true,
            documentCount: count,
            sampleFields: sampleDoc ? Object.keys(sampleDoc).slice(0, 10) : [],
            totalFields: sampleDoc ? Object.keys(sampleDoc).length : 0
          };
        } catch (error) {
          collectionAnalysis[collectionName] = {
            exists: true,
            error: error.message
          };
        }
      } else {
        collectionAnalysis[collectionName] = {
          exists: false
        };
      }
    }
    
    // Get indexes for key collections
    const indexAnalysis = {};
    for (const collectionName of keyCollections) {
      if (collectionNames.includes(collectionName)) {
        try {
          const collection = db.collection(collectionName);
          const indexes = await collection.indexes();
          indexAnalysis[collectionName] = indexes.map(index => ({
            keys: Object.keys(index.key),
            unique: index.unique || false,
            sparse: index.sparse || false
          }));
        } catch (error) {
          indexAnalysis[collectionName] = { error: error.message };
        }
      }
    }
    
    const analysis = {
      timestamp: new Date().toISOString(),
      database: 'weddinglk',
      summary: {
        totalExistingCollections: collectionNames.length,
        totalExpectedCollections: expectedCollections.length,
        matchingCollections: matching.length,
        missingCollections: missing.length,
        extraCollections: extra.length,
        coveragePercentage: Math.round((matching.length / expectedCollections.length) * 100)
      },
      collections: {
        existing: collectionNames,
        expected: expectedCollections,
        matching,
        missing,
        extra
      },
      keyCollectionsAnalysis: collectionAnalysis,
      indexAnalysis,
      recommendations: []
    };
    
    // Generate recommendations
    if (missing.length > 0) {
      analysis.recommendations.push({
        type: 'missing_collections',
        message: `${missing.length} collections are missing from the database`,
        collections: missing.slice(0, 10), // Show first 10
        action: 'Create missing collections with proper schemas'
      });
    }
    
    if (extra.length > 0) {
      analysis.recommendations.push({
        type: 'extra_collections',
        message: `${extra.length} collections exist but are not in the expected schema`,
        collections: extra.slice(0, 10),
        action: 'Review and potentially migrate or remove extra collections'
      });
    }
    
    // Check for missing indexes
    const collectionsNeedingIndexes = [];
    for (const [collectionName, indexes] of Object.entries(indexAnalysis)) {
      if (indexes && !indexes.error && indexes.length < 3) {
        collectionsNeedingIndexes.push(collectionName);
      }
    }
    
    if (collectionsNeedingIndexes.length > 0) {
      analysis.recommendations.push({
        type: 'missing_indexes',
        message: `${collectionsNeedingIndexes.length} collections need more indexes for performance`,
        collections: collectionsNeedingIndexes,
        action: 'Add proper indexes for better query performance'
      });
    }
    
    return NextResponse.json({
      success: true,
      analysis
    });
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

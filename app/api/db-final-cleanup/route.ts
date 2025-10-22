import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import mongoose from 'mongoose';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const db = mongoose.connection.db;
    
    const results = {
      timestamp: new Date().toISOString(),
      operations: [],
      success: true,
      errors: []
    };
    
    // Get all current collections
    const allCollections = await db.listCollections().toArray();
    const allCollectionNames = allCollections.map(col => col.name).sort();
    
    // Expected collections (final schema)
    const expectedCollections = [
      'availability', 'bookingmodifications', 'bookingrequests', 'bookings', 'bookmarks',
      'boostpackages', 'comments', 'commissions', 'conversations', 'documents',
      'dynamicpricings', 'enhancedbookings', 'enhancedposts', 'favorites', 'followers',
      'groups', 'hashtags', 'invoices', 'mentions', 'messageattachments', 'messages',
      'metaadsaccounts', 'metaadsadsets', 'metaadscampaigns', 'metaadscreatives',
      'moderations', 'notificationpreferences', 'notifications', 'packages',
      'passwordresets', 'paymentmethods', 'payments', 'planningtasks', 'posts',
      'quotationrequests', 'quotations', 'reactions', 'reels', 'reviews',
      'servicepackages', 'services', 'shares', 'stories', 'subscriptionplans',
      'subscriptions', 'tasks', 'testimonials', 'twofactorauths', 'userpreferences',
      'users', 'usersessions', 'userverifications', 'vendoravailabilities',
      'vendorpackages', 'vendorportfolios', 'vendorprofiles', 'vendors',
      'vendorservices', 'venueboosts', 'venues', 'verifications', 'weddingplannerprofiles'
    ].sort();
    
    // Find extra collections
    const extraCollections = allCollectionNames.filter(name => !expectedCollections.includes(name));
    
    // Remove all extra collections
    for (const collectionName of extraCollections) {
      try {
        const documentCount = await db.collection(collectionName).countDocuments();
        await db.collection(collectionName).drop();
        results.operations.push({
          operation: 'drop_collection',
          collection: collectionName,
          status: 'success',
          documentsRemoved: documentCount
        });
      } catch (error) {
        results.errors.push({
          operation: `drop_${collectionName}`,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
    
    // Verify final state
    const finalCollections = await db.listCollections().toArray();
    const finalCollectionNames = finalCollections.map(col => col.name).sort();
    
    const matching = finalCollectionNames.filter(name => expectedCollections.includes(name));
    const missing = expectedCollections.filter(name => !finalCollectionNames.includes(name));
    const extra = finalCollectionNames.filter(name => !expectedCollections.includes(name));
    
    results.finalState = {
      totalCollections: finalCollectionNames.length,
      expectedCollections: expectedCollections.length,
      matchingCollections: matching.length,
      missingCollections: missing.length,
      extraCollections: extra.length,
      coveragePercentage: Math.round((matching.length / expectedCollections.length) * 100),
      collections: {
        existing: finalCollectionNames,
        expected: expectedCollections,
        matching,
        missing,
        extra
      }
    };
    
    if (results.errors.length > 0) {
      results.success = false;
    }
    
    return NextResponse.json({
      success: results.success,
      message: results.success ? 'Final database cleanup completed successfully' : 'Some operations failed',
      results
    });
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

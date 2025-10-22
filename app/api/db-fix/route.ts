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
    
    // 1. Rename availabilities to availability
    try {
      const availabilitiesExists = await db.listCollections({ name: 'availabilities' }).toArray();
      const availabilityExists = await db.listCollections({ name: 'availability' }).toArray();
      
      if (availabilitiesExists.length > 0 && availabilityExists.length === 0) {
        await db.collection('availabilities').rename('availability');
        results.operations.push({
          operation: 'rename_collection',
          from: 'availabilities',
          to: 'availability',
          status: 'success'
        });
      } else if (availabilitiesExists.length > 0 && availabilityExists.length > 0) {
        // Both exist, merge data and drop old collection
        const availabilitiesData = await db.collection('availabilities').find({}).toArray();
        if (availabilitiesData.length > 0) {
          await db.collection('availability').insertMany(availabilitiesData);
        }
        await db.collection('availabilities').drop();
        results.operations.push({
          operation: 'merge_and_drop',
          from: 'availabilities',
          to: 'availability',
          status: 'success',
          documentsMerged: availabilitiesData.length
        });
      } else {
        results.operations.push({
          operation: 'rename_collection',
          from: 'availabilities',
          to: 'availability',
          status: 'skipped',
          reason: 'Collection does not exist or already renamed'
        });
      }
    } catch (error) {
      results.errors.push({
        operation: 'rename_availabilities',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
    
    // 2. Clean up test collections
    const testCollections = ['testusers', 'chatrooms', 'clients'];
    
    for (const collectionName of testCollections) {
      try {
        const collectionExists = await db.listCollections({ name: collectionName }).toArray();
        if (collectionExists.length > 0) {
          const documentCount = await db.collection(collectionName).countDocuments();
          await db.collection(collectionName).drop();
          results.operations.push({
            operation: 'drop_collection',
            collection: collectionName,
            status: 'success',
            documentsRemoved: documentCount
          });
        } else {
          results.operations.push({
            operation: 'drop_collection',
            collection: collectionName,
            status: 'skipped',
            reason: 'Collection does not exist'
          });
        }
      } catch (error) {
        results.errors.push({
          operation: `drop_${collectionName}`,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
    
    // 3. Verify final state
    const finalCollections = await db.listCollections().toArray();
    const finalCollectionNames = finalCollections.map(col => col.name).sort();
    
    // Expected collections after cleanup
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
      message: results.success ? 'Database fixes applied successfully' : 'Some operations failed',
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

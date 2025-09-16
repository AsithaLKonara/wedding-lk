import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User, Vendor, Venue, Post, Story, Reel } from '@/lib/models';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    console.log('🌱 Starting database seeding...');
    
    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Vendor.deleteMany({}),
      Venue.deleteMany({}),
      Post.deleteMany({}),
      Story.deleteMany({}),
      Reel.deleteMany({})
    ]);
    
    console.log('🧹 Cleared existing data');
    
    // Create sample users
    const users = [];
    for (let i = 1; i <= 10; i++) {
      const user = new User({
        email: `user${i}@example.com`,
        password: await bcrypt.hash('password123', 12),
        name: `User ${i}`,
        phone: `+9477123456${i}`,
        role: 'user',
        roleVerified: true,
        location: {
          country: 'Sri Lanka',
          state: 'Western Province',
          city: 'Colombo'
        },
        preferences: {
          language: 'en',
          currency: 'LKR',
          timezone: 'Asia/Colombo',
          notifications: { email: true, sms: false, push: true },
          marketing: { email: false, sms: false, push: false }
        },
        avatar: `/images/avatars/user${i}.jpg`,
        bio: `This is user ${i}'s bio`,
        isActive: true,
        emailVerified: true
      });
      await user.save();
      users.push(user);
    }
    
    // Create sample vendors
    const vendors = [];
    const categories = ['photographer', 'decorator', 'catering', 'music', 'transport'];
    for (let i = 1; i <= 5; i++) {
      const vendorUser = new User({
        email: `vendor${i}@example.com`,
        password: await bcrypt.hash('password123', 12),
        name: `Vendor ${i}`,
        phone: `+9477123456${i}`,
        role: 'vendor',
        roleVerified: true,
        location: {
          country: 'Sri Lanka',
          state: 'Western Province',
          city: 'Colombo'
        },
        preferences: {
          language: 'en',
          currency: 'LKR',
          timezone: 'Asia/Colombo',
          notifications: { email: true, sms: false, push: true },
          marketing: { email: false, sms: false, push: false }
        },
        avatar: `/images/avatars/vendor${i}.jpg`,
        bio: `Professional vendor ${i}`,
        isActive: true,
        emailVerified: true
      });
      await vendorUser.save();
      
      const vendor = new Vendor({
        name: `Vendor ${i}`,
        businessName: `Business ${i}`,
        category: categories[i % categories.length],
        description: `Professional ${categories[i % categories.length]} services for your special day`,
        location: {
          address: `${i} Business Street, Colombo`,
          city: 'Colombo',
          province: 'Western Province'
        },
        contact: {
          email: `vendor${i}@example.com`,
          phone: `+9477123456${i}`
        },
        services: [{
          name: `Service ${i}A`,
          description: `Professional service ${i}A`,
          price: 50000 + (i * 10000),
          duration: '2 hours'
        }, {
          name: `Service ${i}B`,
          description: `Professional service ${i}B`,
          price: 30000 + (i * 5000),
          duration: '1 hour'
        }],
        pricing: {
          startingPrice: 50000 + (i * 10000),
          currency: 'LKR'
        },
        owner: vendorUser._id,
        rating: {
          average: 4.0 + (i * 0.2),
          count: i * 5
        },
        isActive: true,
        isVerified: true
      });
      await vendor.save();
      vendors.push(vendor);
    }
    
    // Create sample posts
    const posts = [];
    for (let i = 1; i <= 15; i++) {
      const author = users[i % users.length];
      const post = new Post({
        content: `This is post ${i} content. Beautiful wedding inspiration!`,
        images: [],
        tags: ['wedding', 'inspiration', 'love'],
        author: {
          type: author.role,
          id: author._id,
          name: author.name,
          avatar: author.avatar,
          verified: author.roleVerified
        },
        location: {
          address: `${i} Main Street, Colombo`,
          city: 'Colombo',
          province: 'Western Province'
        },
        engagement: {
          likes: Math.floor(Math.random() * 100),
          comments: Math.floor(Math.random() * 20),
          shares: Math.floor(Math.random() * 10),
          views: Math.floor(Math.random() * 500)
        },
        status: 'active',
        isActive: true
      });
      await post.save();
      posts.push(post);
    }
    
    // Create sample stories
    const stories = [];
    for (let i = 1; i <= 8; i++) {
      const author = users[i % users.length];
      const story = new Story({
        author: {
          type: author.role,
          id: author._id,
          name: author.name,
          avatar: author.avatar,
          verified: author.roleVerified
        },
        content: {
          type: 'image',
          url: `https://via.placeholder.com/400x600.jpg?text=Story+${i}`,
          thumbnail: `https://via.placeholder.com/200x300.jpg?text=Story+${i}`,
          metadata: {
            size: 1024000,
            format: 'jpg',
            dimensions: { width: 400, height: 600 }
          }
        },
        interactiveElements: [],
        views: [],
        reactions: [],
        interactions: [],
        isHighlight: i % 3 === 0,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        status: 'active'
      });
      await story.save();
      stories.push(story);
    }
    
    // Create sample reels
    const reels = [];
    for (let i = 1; i <= 6; i++) {
      const author = users[i % users.length];
      const reel = new Reel({
        author: {
          type: author.role,
          id: author._id,
          name: author.name,
          avatar: author.avatar,
          verified: author.roleVerified
        },
        video: {
          url: `https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4`,
          thumbnail: `https://via.placeholder.com/400x600.jpg`,
          duration: 30,
          size: 1024000,
          resolution: { width: 720, height: 1280 },
          aspectRatio: '9:16'
        },
        audio: {
          track: `Audio Track ${i}`,
          artist: `Artist ${i}`,
          duration: 30
        },
        caption: `Reel ${i} caption`,
        description: `Reel ${i} description`,
        hashtags: ['wedding', 'love', 'inspiration'],
        mentions: [],
        effects: {
          filters: [],
          transitions: [],
          stickers: []
        },
        likes: [],
        comments: [],
        shares: [],
        bookmarks: [],
        settings: {
          allowComments: true,
          allowDuets: true,
          allowStitches: true,
          allowDownloads: false,
          isPublic: true
        },
        metrics: {
          viewCount: Math.floor(Math.random() * 1000),
          likeCount: Math.floor(Math.random() * 200),
          commentCount: Math.floor(Math.random() * 30),
          shareCount: Math.floor(Math.random() * 15),
          bookmarkCount: Math.floor(Math.random() * 50),
          playCount: Math.floor(Math.random() * 1200),
          completionRate: 0.8,
          engagementRate: 0.15
        },
        category: 'wedding',
        tags: ['wedding', 'love', 'inspiration'],
        isTrending: i % 3 === 0,
        trendingScore: Math.random() * 100,
        status: 'published',
        moderationFlags: {
          inappropriate: false,
          copyright: false,
          spam: false,
          violence: false,
          other: []
        },
        publishedAt: new Date()
      });
      await reel.save();
      reels.push(reel);
    }
    
    console.log('✅ Database seeding completed successfully!');
    
    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully',
      data: {
        users: users.length,
        vendors: vendors.length,
        posts: posts.length,
        stories: stories.length,
        reels: reels.length
      }
    });
    
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    return NextResponse.json(
      { error: 'Database seeding failed', details: error.message },
      { status: 500 }
    );
  }
}

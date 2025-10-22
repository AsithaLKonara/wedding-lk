import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { 
  User, 
  Vendor, 
  Venue, 
  Booking, 
  Payment, 
  Review, 
  Notification,
  Task,
  Post
} from '@/lib/models';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    console.log('🚀 Quick fix starting...');

    // Clear all collections
    await User.deleteMany({});
    await Vendor.deleteMany({});
    await Venue.deleteMany({});
    await Booking.deleteMany({});
    await Payment.deleteMany({});
    await Review.deleteMany({});
    await Notification.deleteMany({});
    await Task.deleteMany({});
    await Post.deleteMany({});

    console.log('✅ Cleared all collections');

    // Create a simple user
    const hashedPassword = await bcrypt.hash('TestPassword123!', 12);
    const user = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: hashedPassword,
      role: 'user',
      isActive: true,
      status: 'active',
      location: {
        country: 'Sri Lanka',
        state: 'Western Province',
        city: 'Colombo'
      }
    });
    await user.save();
    console.log('✅ Created test user');

    // Create a simple vendor
    const vendor = new Vendor({
      name: 'Test Photography',
      businessName: 'Test Photography Studio',
      category: 'photographer',
      description: 'Professional wedding photography services',
      location: {
        address: '123 Main Street, Colombo 03',
        city: 'Colombo',
        province: 'Western Province',
        serviceAreas: ['Colombo', 'Gampaha']
      },
      contact: {
        phone: '+94771234567',
        email: 'info@testphotography.com'
      },
      services: [
        {
          name: 'Wedding Photography Package',
          description: 'Full day wedding photography',
          price: 150000,
          duration: '8 hours'
        }
      ],
      pricing: {
        startingPrice: 100000,
        currency: 'LKR'
      },
      rating: {
        average: 4.8,
        count: 25
      },
      owner: user._id
    });
    await vendor.save();
    console.log('✅ Created test vendor');

    // Create a simple venue
    const venue = new Venue({
      name: 'Test Ballroom Hotel',
      description: 'Luxurious wedding venue in Colombo',
      location: {
        address: '789 Independence Avenue, Colombo 07',
        city: 'Colombo',
        province: 'Western Province',
        coordinates: {
          lat: 6.9271,
          lng: 79.8612
        }
      },
      capacity: {
        min: 50,
        max: 300
      },
      pricing: {
        basePrice: 500000,
        currency: 'LKR',
        pricePerGuest: 2000
      },
      amenities: ['Air Conditioning', 'Parking', 'Catering'],
      images: ['/images/venue1.jpg'],
      rating: {
        average: 4.7,
        count: 32
      },
      owner: user._id
    });
    await venue.save();
    console.log('✅ Created test venue');

    // Create a simple booking
    const booking = new Booking({
      user: user._id,
      vendor: vendor._id,
      venue: venue._id,
      eventDate: new Date('2024-12-25'),
      guestCount: 150,
      status: 'confirmed',
      payment: {
        amount: 500000,
        currency: 'LKR',
        status: 'completed',
        method: 'card',
        transactionId: 'TXN123456789'
      }
    });
    await booking.save();
    console.log('✅ Created test booking');

    // Create a simple payment
    const payment = new Payment({
      user: user._id,
      booking: booking._id,
      amount: 500000,
      currency: 'LKR',
      status: 'completed',
      paymentMethod: 'card',
      transactionId: 'TXN123456789',
      type: 'booking'
    });
    await payment.save();
    console.log('✅ Created test payment');

    // Create a simple review
    const review = new Review({
      userId: user._id,
      vendorId: vendor._id,
      bookingId: booking._id,
      overallRating: 5,
      categoryRatings: {
        service: 5,
        quality: 5,
        value: 5,
        communication: 5,
        timeliness: 5
      },
      title: 'Excellent Photography Service',
      comment: 'Amazing work! Highly recommended for wedding photography.',
      pros: ['Professional service', 'Great quality photos'],
      cons: [],
      status: 'approved'
    });
    await review.save();
    console.log('✅ Created test review');

    // Create a simple notification
    const notification = new Notification({
      userId: user._id,
      type: 'booking',
      category: 'success',
      priority: 'high',
      title: 'Booking Confirmed',
      message: 'Your wedding photography booking has been confirmed for December 25, 2024.',
      data: {
        bookingId: booking._id
      },
      channels: {
        inApp: true,
        email: false,
        sms: false,
        push: true
      },
      read: false
    });
    await notification.save();
    console.log('✅ Created test notification');

    // Create a simple task
    const task = new Task({
      title: 'Book photographer',
      description: 'Find and book a wedding photographer',
      category: 'planning',
      assignedTo: user._id,
      createdBy: user._id,
      dueDate: new Date('2024-11-01'),
      status: 'completed',
      priority: 'high'
    });
    await task.save();
    console.log('✅ Created test task');

    // Create a simple post
    const post = new Post({
      author: {
        type: 'user',
        id: user._id,
        name: user.name,
        verified: false
      },
      content: 'Just booked our wedding photographer! So excited for our big day! 💕',
      engagement: {
        likes: 15,
        comments: 3,
        shares: 0,
        views: 50
      },
      userInteractions: {
        likedBy: [],
        bookmarkedBy: [],
        sharedBy: []
      },
      tags: ['wedding', 'photography', 'planning'],
      status: 'active'
    });
    await post.save();
    console.log('✅ Created test post');

    console.log('🎉 Quick fix completed successfully!');

    return NextResponse.json({
      success: true,
      message: 'Quick fix completed successfully',
      data: {
        user: user._id,
        vendor: vendor._id,
        venue: venue._id,
        booking: booking._id,
        payment: payment._id,
        review: review._id,
        notification: notification._id,
        task: task._id,
        post: post._id
      }
    });

  } catch (error) {
    console.error('Quick fix error:', error);
    return NextResponse.json({
      success: false,
      message: 'Quick fix failed',
      error: error.message
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Use POST method to run quick fix',
    description: 'This will clear all data and create basic test data'
  });
}

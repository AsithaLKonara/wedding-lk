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
  Post,
  Service
} from '@/lib/models';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Vendor.deleteMany({});
    await Venue.deleteMany({});
    await Booking.deleteMany({});
    await Payment.deleteMany({});
    await Review.deleteMany({});
    await Notification.deleteMany({});
    await Task.deleteMany({});
    await Post.deleteMany({});
    await Service.deleteMany({});

    console.log('✅ Cleared existing data');

    // Create test users
    const hashedPassword = await bcrypt.hash('TestPassword123!', 12);
    
    const users = [
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: hashedPassword,
        role: 'user',
        isActive: true,
        status: 'active',
        location: {
          country: 'Sri Lanka',
          state: 'Western Province',
          city: 'Colombo'
        }
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: hashedPassword,
        role: 'user',
        isActive: true,
        status: 'active',
        location: {
          country: 'Sri Lanka',
          state: 'Western Province',
          city: 'Colombo'
        }
      },
      {
        name: 'Admin User',
        email: 'admin@weddinglk.com',
        password: hashedPassword,
        role: 'admin',
        isActive: true,
        status: 'active',
        location: {
          country: 'Sri Lanka',
          state: 'Western Province',
          city: 'Colombo'
        }
      }
    ];

    const createdUsers = await User.insertMany(users);
    console.log(`✅ Created ${createdUsers.length} users`);

    // Create test vendors
    const vendors = [
      {
        name: 'Perfect Photography',
        businessName: 'Perfect Photography Studio',
        category: 'photographer',
        description: 'Professional wedding photography services',
        location: {
          address: '123 Main Street, Colombo 03',
          city: 'Colombo',
          province: 'Western Province',
          serviceAreas: ['Colombo', 'Gampaha', 'Kalutara']
        },
        contact: {
          phone: '+94771234567',
          email: 'info@perfectphotography.com',
          website: 'https://perfectphotography.com'
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
        owner: createdUsers[0]._id
      },
      {
        name: 'Elegant Catering',
        businessName: 'Elegant Catering Services',
        category: 'catering',
        description: 'Premium wedding catering services',
        location: {
          address: '456 Galle Road, Colombo 04',
          city: 'Colombo',
          province: 'Western Province',
          serviceAreas: ['Colombo', 'Gampaha']
        },
        contact: {
          phone: '+94771234568',
          email: 'info@elegantcatering.com'
        },
        services: [
          {
            name: 'Wedding Buffet Package',
            description: 'Complete wedding buffet for 100 guests',
            price: 200000,
            duration: 'Full day'
          }
        ],
        pricing: {
          startingPrice: 150000,
          currency: 'LKR'
        },
        rating: {
          average: 4.6,
          count: 18
        },
        owner: createdUsers[1]._id
      }
    ];

    const createdVendors = await Vendor.insertMany(vendors);
    console.log(`✅ Created ${createdVendors.length} vendors`);

    // Create test venues
    const venues = [
      {
        name: 'Grand Ballroom Hotel',
        description: 'Luxurious wedding venue in the heart of Colombo',
        location: {
          address: '789 Independence Avenue, Colombo 07',
          city: 'Colombo',
          province: 'Western Province',
          coordinates: {
            latitude: 6.9271,
            longitude: 79.8612
          }
        },
        capacity: 300,
        pricing: {
          startingPrice: 500000,
          currency: 'LKR'
        },
        amenities: ['Air Conditioning', 'Parking', 'Catering', 'Sound System'],
        images: ['/images/venue1.jpg', '/images/venue2.jpg'],
        rating: {
          average: 4.7,
          count: 32
        },
        owner: createdUsers[0]._id
      },
      {
        name: 'Garden Paradise',
        description: 'Beautiful outdoor wedding venue with garden setting',
        location: {
          address: '321 Kandy Road, Kandy',
          city: 'Kandy',
          province: 'Central Province',
          coordinates: {
            latitude: 7.2906,
            longitude: 80.6337
          }
        },
        capacity: 150,
        pricing: {
          startingPrice: 300000,
          currency: 'LKR'
        },
        amenities: ['Garden', 'Parking', 'Catering', 'Photography Spots'],
        images: ['/images/garden1.jpg', '/images/garden2.jpg'],
        rating: {
          average: 4.5,
          count: 28
        },
        owner: createdUsers[1]._id
      }
    ];

    const createdVenues = await Venue.insertMany(venues);
    console.log(`✅ Created ${createdVenues.length} venues`);

    // Create test bookings
    const bookings = [
      {
        client: createdUsers[0]._id,
        vendor: createdVendors[0]._id,
        venue: createdVenues[0]._id,
        eventDate: new Date('2024-12-25'),
        guestCount: 150,
        totalPrice: 500000,
        status: 'confirmed',
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        customerPhone: '+94771234567'
      },
      {
        client: createdUsers[1]._id,
        vendor: createdVendors[1]._id,
        venue: createdVenues[1]._id,
        eventDate: new Date('2024-12-30'),
        guestCount: 100,
        totalPrice: 350000,
        status: 'pending',
        customerName: 'Jane Smith',
        customerEmail: 'jane@example.com',
        customerPhone: '+94771234568'
      }
    ];

    const createdBookings = await Booking.insertMany(bookings);
    console.log(`✅ Created ${createdBookings.length} bookings`);

    // Create test payments
    const payments = [
      {
        userId: createdUsers[0]._id,
        bookingId: createdBookings[0]._id,
        amount: 500000,
        currency: 'LKR',
        status: 'completed',
        paymentMethod: 'credit_card',
        transactionId: 'TXN123456789'
      },
      {
        userId: createdUsers[1]._id,
        bookingId: createdBookings[1]._id,
        amount: 175000,
        currency: 'LKR',
        status: 'pending',
        paymentMethod: 'bank_transfer',
        transactionId: 'TXN987654321'
      }
    ];

    const createdPayments = await Payment.insertMany(payments);
    console.log(`✅ Created ${createdPayments.length} payments`);

    // Create test reviews
    const reviews = [
      {
        userId: createdUsers[0]._id,
        vendorId: createdVendors[0]._id,
        bookingId: createdBookings[0]._id,
        rating: 5,
        title: 'Excellent Photography Service',
        comment: 'Amazing work! Highly recommended for wedding photography.',
        images: ['/images/review1.jpg'],
        status: 'approved'
      },
      {
        userId: createdUsers[1]._id,
        vendorId: createdVendors[1]._id,
        bookingId: createdBookings[1]._id,
        rating: 4,
        title: 'Good Catering Service',
        comment: 'Food was delicious and service was professional.',
        status: 'approved'
      }
    ];

    const createdReviews = await Review.insertMany(reviews);
    console.log(`✅ Created ${createdReviews.length} reviews`);

    // Create test notifications
    const notifications = [
      {
        userId: createdUsers[0]._id,
        type: 'booking_confirmed',
        title: 'Booking Confirmed',
        message: 'Your wedding photography booking has been confirmed for December 25, 2024.',
        read: false
      },
      {
        userId: createdUsers[1]._id,
        type: 'payment_received',
        title: 'Payment Received',
        message: 'Your payment of LKR 175,000 has been received.',
        read: false
      }
    ];

    const createdNotifications = await Notification.insertMany(notifications);
    console.log(`✅ Created ${createdNotifications.length} notifications`);

    // Create test tasks
    const tasks = [
      {
        title: 'Book photographer',
        description: 'Find and book a wedding photographer',
        assignedTo: createdUsers[0]._id,
        dueDate: new Date('2024-11-01'),
        status: 'completed',
        priority: 'high'
      },
      {
        title: 'Choose wedding venue',
        description: 'Select and book wedding venue',
        assignedTo: createdUsers[1]._id,
        dueDate: new Date('2024-11-15'),
        status: 'in_progress',
        priority: 'high'
      }
    ];

    const createdTasks = await Task.insertMany(tasks);
    console.log(`✅ Created ${createdTasks.length} tasks`);

    // Create test posts
    const posts = [
      {
        author: createdUsers[0]._id,
        content: 'Just booked our wedding photographer! So excited for our big day! 💕',
        images: ['/images/post1.jpg'],
        likes: 15,
        comments: 3,
        type: 'wedding_planning'
      },
      {
        author: createdUsers[1]._id,
        content: 'Found the perfect venue for our wedding. The garden setting is absolutely beautiful! 🌸',
        images: ['/images/post2.jpg'],
        likes: 22,
        comments: 7,
        type: 'venue_showcase'
      }
    ];

    const createdPosts = await Post.insertMany(posts);
    console.log(`✅ Created ${createdPosts.length} posts`);

    console.log('🎉 Database seeding completed successfully!');

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully',
      data: {
        users: createdUsers.length,
        vendors: createdVendors.length,
        venues: createdVenues.length,
        bookings: createdBookings.length,
        payments: createdPayments.length,
        reviews: createdReviews.length,
        notifications: createdNotifications.length,
        tasks: createdTasks.length,
        posts: createdPosts.length
      }
    });

  } catch (error) {
    console.error('Database seeding error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to seed database',
      error: error.message
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Use POST method to seed the database',
    warning: 'This will clear all existing data!'
  });
}
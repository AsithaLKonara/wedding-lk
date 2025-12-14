import { connectDB } from './db';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User } from './models/user';

// Simple seed data creation
export async function createSimpleSeedData() {
  try {
    await connectDB();
    console.log('🌱 Starting simple seed data creation...');

    // Create 5 simple users
    const users = await createSimpleUsers();
    
    console.log('🎉 Simple seed data creation completed!');
    return users;
  } catch (error) {
    console.error('❌ Simple seed data creation failed:', error);
    throw error;
  }
}

// Create 5 simple users
async function createSimpleUsers() {
  const users = [];
  const hashedPassword = await bcrypt.hash('password123', 12);
  
  const userData = [
    {
      email: 'john.doe@email.com',
      password: hashedPassword,
      name: 'John Doe',
      role: 'user',
      phone: '+94 77 123 4567',
      location: {
        country: 'Sri Lanka',
        state: 'Western Province',
        city: 'Colombo'
      },
      preferences: {
        language: 'en',
        currency: 'LKR',
        timezone: 'Asia/Colombo',
        notifications: {
          email: true,
          sms: false,
          push: true
        },
        marketing: {
          email: true,
          sms: false,
          push: false
        }
      }
    },
    {
      email: 'jane.smith@email.com',
      password: hashedPassword,
      name: 'Jane Smith',
      role: 'user',
      phone: '+94 77 234 5678',
      location: {
        country: 'Sri Lanka',
        state: 'Central Province',
        city: 'Kandy'
      },
      preferences: {
        language: 'en',
        currency: 'LKR',
        timezone: 'Asia/Colombo',
        notifications: {
          email: true,
          sms: false,
          push: true
        },
        marketing: {
          email: true,
          sms: false,
          push: false
        }
      }
    },
    {
      email: 'mike.wilson@email.com',
      password: hashedPassword,
      name: 'Mike Wilson',
      role: 'user',
      phone: '+94 77 345 6789',
      location: {
        country: 'Sri Lanka',
        state: 'Southern Province',
        city: 'Galle'
      },
      preferences: {
        language: 'en',
        currency: 'LKR',
        timezone: 'Asia/Colombo',
        notifications: {
          email: true,
          sms: false,
          push: true
        },
        marketing: {
          email: true,
          sms: false,
          push: false
        }
      }
    },
    {
      email: 'sarah.brown@email.com',
      password: hashedPassword,
      name: 'Sarah Brown',
      role: 'user',
      phone: '+94 77 456 7890',
      location: {
        country: 'Sri Lanka',
        state: 'Western Province',
        city: 'Negombo'
      },
      preferences: {
        language: 'en',
        currency: 'LKR',
        timezone: 'Asia/Colombo',
        notifications: {
          email: true,
          sms: false,
          push: true
        },
        marketing: {
          email: true,
          sms: false,
          push: false
        }
      }
    },
    {
      email: 'david.jones@email.com',
      password: hashedPassword,
      name: 'David Jones',
      role: 'user',
      phone: '+94 77 567 8901',
      location: {
        country: 'Sri Lanka',
        state: 'North Central Province',
        city: 'Anuradhapura'
      },
      preferences: {
        language: 'en',
        currency: 'LKR',
        timezone: 'Asia/Colombo',
        notifications: {
          email: true,
          sms: false,
          push: true
        },
        marketing: {
          email: true,
          sms: false,
          push: false
        }
      }
    }
  ];

  for (const userDataItem of userData) {
    const user = new User(userDataItem);
    await user.save();
    users.push(user);
    console.log(`✅ Created user: ${user.name}`);
  }

  return users;
}

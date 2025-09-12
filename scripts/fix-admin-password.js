const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://asithalakmalkonara11992081:1234@cluster0.ezztfbi.mongodb.net/weddinglk?retryWrites=true&w=majority&appName=Cluster0';

async function fixAdminPassword() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    const db = client.db('weddinglk');
    const users = db.collection('users');
    
    console.log('🔧 Fixing admin password...');
    
    // Hash the correct password
    const correctPassword = 'password123';
    const hashedPassword = await bcrypt.hash(correctPassword, 12);
    
    console.log('New password hash:', hashedPassword);
    
    // Update admin user
    const result = await users.updateOne(
      { email: 'admin@weddinglk.com' },
      { 
        $set: { 
          password: hashedPassword,
          updatedAt: new Date()
        }
      }
    );
    
    if (result.modifiedCount > 0) {
      console.log('✅ Admin password updated successfully');
      
      // Verify the password works
      const adminUser = await users.findOne({ email: 'admin@weddinglk.com' });
      const isMatch = await bcrypt.compare(correctPassword, adminUser.password);
      console.log('Password verification:', isMatch);
    } else {
      console.log('❌ Failed to update admin password');
    }
    
    // Also create a test user with known credentials
    const testUser = {
      name: 'Test User',
      email: 'test@example.com',
      password: hashedPassword,
      role: 'user',
      isActive: true,
      isVerified: true,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Check if test user exists
    const existingTestUser = await users.findOne({ email: 'test@example.com' });
    if (!existingTestUser) {
      await users.insertOne(testUser);
      console.log('✅ Test user created');
    } else {
      await users.updateOne(
        { email: 'test@example.com' },
        { $set: { password: hashedPassword, updatedAt: new Date() } }
      );
      console.log('✅ Test user password updated');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

fixAdminPassword();

const bcrypt = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://asithalakmalkonara11992081:1234@cluster0.ezztfbi.mongodb.net/weddinglk?retryWrites=true&w=majority&appName=Cluster0';

async function fixAdminPassword() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    const db = client.db('weddinglk');
    const users = db.collection('users');
    
    console.log('🔧 Fixing admin password...');
    
    // Hash the correct password
    const correctPassword = 'password123';
    const hashedPassword = await bcrypt.hash(correctPassword, 12);
    
    console.log('New password hash:', hashedPassword);
    
    // Update admin user
    const result = await users.updateOne(
      { email: 'admin@weddinglk.com' },
      { 
        $set: { 
          password: hashedPassword,
          updatedAt: new Date()
        }
      }
    );
    
    if (result.modifiedCount > 0) {
      console.log('✅ Admin password updated successfully');
      
      // Verify the password works
      const adminUser = await users.findOne({ email: 'admin@weddinglk.com' });
      const isMatch = await bcrypt.compare(correctPassword, adminUser.password);
      console.log('Password verification:', isMatch);
    } else {
      console.log('❌ Failed to update admin password');
    }
    
    // Also create a test user with known credentials
    const testUser = {
      name: 'Test User',
      email: 'test@example.com',
      password: hashedPassword,
      role: 'user',
      isActive: true,
      isVerified: true,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Check if test user exists
    const existingTestUser = await users.findOne({ email: 'test@example.com' });
    if (!existingTestUser) {
      await users.insertOne(testUser);
      console.log('✅ Test user created');
    } else {
      await users.updateOne(
        { email: 'test@example.com' },
        { $set: { password: hashedPassword, updatedAt: new Date() } }
      );
      console.log('✅ Test user password updated');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

fixAdminPassword();

const bcrypt = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://asithalakmalkonara11992081:1234@cluster0.ezztfbi.mongodb.net/weddinglk?retryWrites=true&w=majority&appName=Cluster0';

async function fixAdminPassword() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    const db = client.db('weddinglk');
    const users = db.collection('users');
    
    console.log('🔧 Fixing admin password...');
    
    // Hash the correct password
    const correctPassword = 'password123';
    const hashedPassword = await bcrypt.hash(correctPassword, 12);
    
    console.log('New password hash:', hashedPassword);
    
    // Update admin user
    const result = await users.updateOne(
      { email: 'admin@weddinglk.com' },
      { 
        $set: { 
          password: hashedPassword,
          updatedAt: new Date()
        }
      }
    );
    
    if (result.modifiedCount > 0) {
      console.log('✅ Admin password updated successfully');
      
      // Verify the password works
      const adminUser = await users.findOne({ email: 'admin@weddinglk.com' });
      const isMatch = await bcrypt.compare(correctPassword, adminUser.password);
      console.log('Password verification:', isMatch);
    } else {
      console.log('❌ Failed to update admin password');
    }
    
    // Also create a test user with known credentials
    const testUser = {
      name: 'Test User',
      email: 'test@example.com',
      password: hashedPassword,
      role: 'user',
      isActive: true,
      isVerified: true,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Check if test user exists
    const existingTestUser = await users.findOne({ email: 'test@example.com' });
    if (!existingTestUser) {
      await users.insertOne(testUser);
      console.log('✅ Test user created');
    } else {
      await users.updateOne(
        { email: 'test@example.com' },
        { $set: { password: hashedPassword, updatedAt: new Date() } }
      );
      console.log('✅ Test user password updated');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

fixAdminPassword();

const bcrypt = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://asithalakmalkonara11992081:1234@cluster0.ezztfbi.mongodb.net/weddinglk?retryWrites=true&w=majority&appName=Cluster0';

async function fixAdminPassword() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    const db = client.db('weddinglk');
    const users = db.collection('users');
    
    console.log('🔧 Fixing admin password...');
    
    // Hash the correct password
    const correctPassword = 'password123';
    const hashedPassword = await bcrypt.hash(correctPassword, 12);
    
    console.log('New password hash:', hashedPassword);
    
    // Update admin user
    const result = await users.updateOne(
      { email: 'admin@weddinglk.com' },
      { 
        $set: { 
          password: hashedPassword,
          updatedAt: new Date()
        }
      }
    );
    
    if (result.modifiedCount > 0) {
      console.log('✅ Admin password updated successfully');
      
      // Verify the password works
      const adminUser = await users.findOne({ email: 'admin@weddinglk.com' });
      const isMatch = await bcrypt.compare(correctPassword, adminUser.password);
      console.log('Password verification:', isMatch);
    } else {
      console.log('❌ Failed to update admin password');
    }
    
    // Also create a test user with known credentials
    const testUser = {
      name: 'Test User',
      email: 'test@example.com',
      password: hashedPassword,
      role: 'user',
      isActive: true,
      isVerified: true,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Check if test user exists
    const existingTestUser = await users.findOne({ email: 'test@example.com' });
    if (!existingTestUser) {
      await users.insertOne(testUser);
      console.log('✅ Test user created');
    } else {
      await users.updateOne(
        { email: 'test@example.com' },
        { $set: { password: hashedPassword, updatedAt: new Date() } }
      );
      console.log('✅ Test user password updated');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

fixAdminPassword();

const bcrypt = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://asithalakmalkonara11992081:1234@cluster0.ezztfbi.mongodb.net/weddinglk?retryWrites=true&w=majority&appName=Cluster0';

async function fixAdminPassword() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    const db = client.db('weddinglk');
    const users = db.collection('users');
    
    console.log('🔧 Fixing admin password...');
    
    // Hash the correct password
    const correctPassword = 'password123';
    const hashedPassword = await bcrypt.hash(correctPassword, 12);
    
    console.log('New password hash:', hashedPassword);
    
    // Update admin user
    const result = await users.updateOne(
      { email: 'admin@weddinglk.com' },
      { 
        $set: { 
          password: hashedPassword,
          updatedAt: new Date()
        }
      }
    );
    
    if (result.modifiedCount > 0) {
      console.log('✅ Admin password updated successfully');
      
      // Verify the password works
      const adminUser = await users.findOne({ email: 'admin@weddinglk.com' });
      const isMatch = await bcrypt.compare(correctPassword, adminUser.password);
      console.log('Password verification:', isMatch);
    } else {
      console.log('❌ Failed to update admin password');
    }
    
    // Also create a test user with known credentials
    const testUser = {
      name: 'Test User',
      email: 'test@example.com',
      password: hashedPassword,
      role: 'user',
      isActive: true,
      isVerified: true,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Check if test user exists
    const existingTestUser = await users.findOne({ email: 'test@example.com' });
    if (!existingTestUser) {
      await users.insertOne(testUser);
      console.log('✅ Test user created');
    } else {
      await users.updateOne(
        { email: 'test@example.com' },
        { $set: { password: hashedPassword, updatedAt: new Date() } }
      );
      console.log('✅ Test user password updated');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

fixAdminPassword();

const bcrypt = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://asithalakmalkonara11992081:1234@cluster0.ezztfbi.mongodb.net/weddinglk?retryWrites=true&w=majority&appName=Cluster0';

async function fixAdminPassword() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    const db = client.db('weddinglk');
    const users = db.collection('users');
    
    console.log('🔧 Fixing admin password...');
    
    // Hash the correct password
    const correctPassword = 'password123';
    const hashedPassword = await bcrypt.hash(correctPassword, 12);
    
    console.log('New password hash:', hashedPassword);
    
    // Update admin user
    const result = await users.updateOne(
      { email: 'admin@weddinglk.com' },
      { 
        $set: { 
          password: hashedPassword,
          updatedAt: new Date()
        }
      }
    );
    
    if (result.modifiedCount > 0) {
      console.log('✅ Admin password updated successfully');
      
      // Verify the password works
      const adminUser = await users.findOne({ email: 'admin@weddinglk.com' });
      const isMatch = await bcrypt.compare(correctPassword, adminUser.password);
      console.log('Password verification:', isMatch);
    } else {
      console.log('❌ Failed to update admin password');
    }
    
    // Also create a test user with known credentials
    const testUser = {
      name: 'Test User',
      email: 'test@example.com',
      password: hashedPassword,
      role: 'user',
      isActive: true,
      isVerified: true,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Check if test user exists
    const existingTestUser = await users.findOne({ email: 'test@example.com' });
    if (!existingTestUser) {
      await users.insertOne(testUser);
      console.log('✅ Test user created');
    } else {
      await users.updateOne(
        { email: 'test@example.com' },
        { $set: { password: hashedPassword, updatedAt: new Date() } }
      );
      console.log('✅ Test user password updated');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

fixAdminPassword();

const bcrypt = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://asithalakmalkonara11992081:1234@cluster0.ezztfbi.mongodb.net/weddinglk?retryWrites=true&w=majority&appName=Cluster0';

async function fixAdminPassword() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    const db = client.db('weddinglk');
    const users = db.collection('users');
    
    console.log('🔧 Fixing admin password...');
    
    // Hash the correct password
    const correctPassword = 'password123';
    const hashedPassword = await bcrypt.hash(correctPassword, 12);
    
    console.log('New password hash:', hashedPassword);
    
    // Update admin user
    const result = await users.updateOne(
      { email: 'admin@weddinglk.com' },
      { 
        $set: { 
          password: hashedPassword,
          updatedAt: new Date()
        }
      }
    );
    
    if (result.modifiedCount > 0) {
      console.log('✅ Admin password updated successfully');
      
      // Verify the password works
      const adminUser = await users.findOne({ email: 'admin@weddinglk.com' });
      const isMatch = await bcrypt.compare(correctPassword, adminUser.password);
      console.log('Password verification:', isMatch);
    } else {
      console.log('❌ Failed to update admin password');
    }
    
    // Also create a test user with known credentials
    const testUser = {
      name: 'Test User',
      email: 'test@example.com',
      password: hashedPassword,
      role: 'user',
      isActive: true,
      isVerified: true,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Check if test user exists
    const existingTestUser = await users.findOne({ email: 'test@example.com' });
    if (!existingTestUser) {
      await users.insertOne(testUser);
      console.log('✅ Test user created');
    } else {
      await users.updateOne(
        { email: 'test@example.com' },
        { $set: { password: hashedPassword, updatedAt: new Date() } }
      );
      console.log('✅ Test user password updated');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

fixAdminPassword();

const bcrypt = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://asithalakmalkonara11992081:1234@cluster0.ezztfbi.mongodb.net/weddinglk?retryWrites=true&w=majority&appName=Cluster0';

async function fixAdminPassword() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    const db = client.db('weddinglk');
    const users = db.collection('users');
    
    console.log('🔧 Fixing admin password...');
    
    // Hash the correct password
    const correctPassword = 'password123';
    const hashedPassword = await bcrypt.hash(correctPassword, 12);
    
    console.log('New password hash:', hashedPassword);
    
    // Update admin user
    const result = await users.updateOne(
      { email: 'admin@weddinglk.com' },
      { 
        $set: { 
          password: hashedPassword,
          updatedAt: new Date()
        }
      }
    );
    
    if (result.modifiedCount > 0) {
      console.log('✅ Admin password updated successfully');
      
      // Verify the password works
      const adminUser = await users.findOne({ email: 'admin@weddinglk.com' });
      const isMatch = await bcrypt.compare(correctPassword, adminUser.password);
      console.log('Password verification:', isMatch);
    } else {
      console.log('❌ Failed to update admin password');
    }
    
    // Also create a test user with known credentials
    const testUser = {
      name: 'Test User',
      email: 'test@example.com',
      password: hashedPassword,
      role: 'user',
      isActive: true,
      isVerified: true,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Check if test user exists
    const existingTestUser = await users.findOne({ email: 'test@example.com' });
    if (!existingTestUser) {
      await users.insertOne(testUser);
      console.log('✅ Test user created');
    } else {
      await users.updateOne(
        { email: 'test@example.com' },
        { $set: { password: hashedPassword, updatedAt: new Date() } }
      );
      console.log('✅ Test user password updated');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

fixAdminPassword();



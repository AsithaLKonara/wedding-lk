const fs = require('fs');
const path = require('path');

// Database directory
const DB_DIR = path.join(process.cwd(), 'database');
const SAMPLE_DATA_FILE = path.join(DB_DIR, 'sample-data.json');

// Database file paths
const DB_FILES = {
  users: path.join(DB_DIR, 'users.json'),
  vendors: path.join(DB_DIR, 'vendors.json'),
  venues: path.join(DB_DIR, 'venues.json'),
  bookings: path.join(DB_DIR, 'bookings.json'),
  tasks: path.join(DB_DIR, 'tasks.json'),
  payments: path.join(DB_DIR, 'payments.json'),
  reviews: path.join(DB_DIR, 'reviews.json'),
};

async function initializeLocalDatabase() {
  try {
    console.log('🚀 Initializing local database...');
    
    // Ensure database directory exists
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
      console.log('✅ Created database directory');
    }
    
    // Read sample data
    if (!fs.existsSync(SAMPLE_DATA_FILE)) {
      console.error('❌ Sample data file not found:', SAMPLE_DATA_FILE);
      return;
    }
    
    const sampleData = JSON.parse(fs.readFileSync(SAMPLE_DATA_FILE, 'utf8'));
    console.log('✅ Loaded sample data');
    
    // Initialize each database file
    Object.entries(DB_FILES).forEach(([table, filePath]) => {
      const data = sampleData[table] || [];
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      console.log(`✅ Initialized ${table}.json with ${data.length} records`);
    });
    
    console.log('\n🎉 Local database initialization completed successfully!');
    console.log('\n📊 Database Summary:');
    Object.entries(sampleData).forEach(([table, data]) => {
      console.log(`   - ${table}: ${data.length} records`);
    });
    
    console.log('\n🔑 Test Credentials:');
    console.log('   Admin: admin1@wedding.lk / admin123');
    console.log('   User: user1@example.com / user123');
    console.log('   Vendor: vendor1@example.com / vendor123');
    console.log('   Planner: planner1@example.com / planner123');
    
    console.log('\n📁 Database files created in:', DB_DIR);
    
  } catch (error) {
    console.error('❌ Error initializing local database:', error);
  }
}

// Run initialization
initializeLocalDatabase();

// Load test environment variables
require('dotenv').config({ path: '.env.test' });

// Set default test environment variables if not set
process.env.NODE_ENV = process.env.NODE_ENV || 'test';
// CRITICAL: Use MongoDB Atlas URI, not localhost - localhost causes connection failures
// Only use localhost if explicitly set via TEST_DB_URI env var
const DEFAULT_ATLAS_URI = 'mongodb+srv://asithalakmalkonara11992081:1234@cluster0.ezztfbi.mongodb.net/weddinglk_test?retryWrites=true&w=majority&appName=Cluster0';
process.env.TEST_DB_URI = process.env.TEST_DB_URI || DEFAULT_ATLAS_URI;



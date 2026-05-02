
const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://asithalakmalkonara11992081:A$!tha2000@cluster0.dmku2nn.mongodb.net/?appName=Cluster0';

async function test() {
    console.log(`Testing with new password...`);
    const client = new MongoClient(uri);
    try {
        await client.connect();
        console.log(`✅ Connected successfully!`);
        await client.close();
        return true;
    } catch (e) {
        console.log(`❌ Failed: ${e.message}`);
        return false;
    }
}

test();
